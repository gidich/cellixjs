import { randomUUID } from "node:crypto";
import type { ServiceBase } from "@cellix/api-services-spec";
import { QueueStorageSeedwork } from "@cellix/data-sources-queue-storage";

export type SenderRegistration<TPayload> = {
  queueName: string;
  schema: QueueStorageSeedwork.JSONSchema<TPayload>;
  payloadType: QueueStorageSeedwork.PayloadTypeEnum;
  extractLogTags?: (payload: QueueStorageSeedwork.MessageType<TPayload>) => Record<string, unknown>;
  extractLogMetadata?: (payload: QueueStorageSeedwork.MessageType<TPayload>) => Record<string, unknown>;
};

/* 
This TypeScript type, QueueSenderApi<T>, defines an API shape for sending messages to a queue system. 
For each key in the type T, it creates a function that:
- Accepts a payload whose type is inferred from the schema property of T[K] (if it exists and matches QueueStorageSeedwork.JSONSchema<...>).
- Optionally accepts an eventId string.
- Returns a Promise<void>, indicating asynchronous operation with no return value.
- This pattern is useful for strongly-typed message sending, ensuring each queue message matches its expected schema.
*/
export type QueueSenderApi<T> = {
  [K in keyof T]: (payload: T[K] extends { schema: QueueStorageSeedwork.JSONSchema<infer P> } ? P : never, eventId?: string) => Promise<void>;
};

export interface QueueSender {
  registerSender<TPayload>(registration: SenderRegistration<TPayload>): void;
  createFactory<T extends object>(config: T): QueueSenderApi<T>;
}
export interface QueueSenderContext {
  service: QueueSender;
}

export class ServiceQueueSender implements ServiceBase<QueueSenderContext>, QueueSenderContext {
  private readonly accountName: string;
  private readonly accountKey: string;
  private serviceInternal: QueueStorageSeedwork.BaseQueueSenderImpl | undefined;
  private readonly senderRegistry: Map<string, SenderRegistration<unknown>> = new Map();

  constructor(accountName: string, accountKey: string) {
    if (!accountName || accountName.trim() === "") {
      throw new Error("Account name is required");
    }
    if (!accountKey || accountKey.trim() === "") {
      throw new Error("Account key is required");
    }
    this.accountName = accountName;
    this.accountKey = accountKey;
  }

  public startUp(): Promise<ServiceQueueSender> {
    this.serviceInternal = new QueueStorageSeedwork.BaseQueueSenderImpl(this.accountName, this.accountKey);
    return Promise.resolve(this);
  }
  public shutDown(): Promise<void> {
    if (!this.serviceInternal) {
      throw new Error("ServiceQueueSender is not started - shutdown cannot proceed");
    }
    console.log("ServiceQueueSender stopped");
    return Promise.resolve();
  }
  /**
   * Factory method to generate a type-safe API for all registered senders.
   * Usage:
   *   const myQueueApi = ServiceQueueSender.createFactory(queueSender, config);
   *   await myQueueApi.toOutboundExampleQueue(payload);
   */
  public createFactory<T extends object>(config: T): QueueSenderApi<T> {
    const result = {} as Partial<QueueSenderApi<T>>;
    for (const key in config) {
      const reg = config[key] as SenderRegistration<unknown> | undefined;
      if (!reg) {
        throw new Error(`Invalid registration for queue: ${key}`);
      }
      type PayloadType = T[typeof key] extends SenderRegistration<infer P> ? P : never;
      result[key] = ((payload: PayloadType, eventId?: string) =>
        this.sendMessageToQueue(reg.queueName, payload, eventId)) as QueueSenderApi<T>[typeof key];
    }
    return result as QueueSenderApi<T>;
  }
  /**
   * Register a sender for a specific queue.
   * @param registration SenderRegistration<TPayload>
   */
  public registerSender<TPayload>(registration: SenderRegistration<TPayload>): void {
    this.senderRegistry.set(registration.queueName, registration as SenderRegistration<unknown>);
    console.log("ServiceQueueSender | registered sender >", registration.queueName);
  }
  /**
   * Send a message to a registered queue. Looks up the registration by queueName.
   * @param queueName The queue name to send to
   * @param payload The payload to send
   * @param eventId Required eventId for the message
   */
  // [NN] [ESLINT] disabling eslint@typescript-eslint/no-unnecessary-type-parameters
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  private async sendMessageToQueue<TPayload>(queueName: string, payload: TPayload, eventId?: string): Promise<void> {
    if (!this.serviceInternal) {
      throw new Error("ServiceQueueSender is not started - cannot send message");
    }
    const registration = this.senderRegistry.get(queueName) as SenderRegistration<TPayload> | undefined;
    if (!registration) {
      throw new Error(`No sender registered for queue: ${queueName}`);
    }
    eventId ??= this.generateEventId();
    const sendMessageOutput = await this.serviceInternal.sendMessage<TPayload>(
      registration.queueName,
      registration.schema,
      payload,
      registration.payloadType,
      eventId
    );
    // Logging (optional)
    this.serviceInternal.logMessage<TPayload>(
      sendMessageOutput.eventId,
      sendMessageOutput.messageJson,
      registration.extractLogTags ? registration.extractLogTags(sendMessageOutput.messageJson) : {},
      registration.extractLogMetadata ? registration.extractLogMetadata(sendMessageOutput.messageJson) : {}
    );
  }
  private generateEventId(): string {
    return randomUUID();
  }
  public get service(): QueueSender {
    if (!this.serviceInternal) {
      throw new Error("ServiceQueueSender is not started - cannot access service");
    }
    return this;
  }
}
