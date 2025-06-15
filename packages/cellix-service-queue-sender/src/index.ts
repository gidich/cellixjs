import { randomUUID } from 'node:crypto';
import type { ServiceBase } from '@cellix/api-services-spec';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';

export type SenderRegistration<TPayload> = {
  queueName: string;
  schema: QueueStorageSeedwork.JSONSchema<TPayload>;
  payloadType: QueueStorageSeedwork.PayloadTypeEnum;
  extractLogTags?: (payload: QueueStorageSeedwork.MessageType<TPayload>) => Record<string, unknown>;
  extractLogMetadata?: (payload: QueueStorageSeedwork.MessageType<TPayload>) => Record<string, unknown>;
};

export type QueueSenderApi<T> = {
  [K in keyof T]: (
    payload: T[K] extends { schema: QueueStorageSeedwork.JSONSchema<infer P> } ? P : never,
    eventId?: string
  ) => Promise<void>;
};

export interface QueueSender {
  registerSender<TPayload>(registration: SenderRegistration<TPayload>): void;
  createFactory<T>(config: T): QueueSenderApi<T>;
  // sendMessageToQueue<TPayload>(queueName: string, payload: TPayload, eventId?: string): Promise<void>;
}
export interface QueueSenderContext {
  service: QueueSender;
  // api: ReturnType<QueueSender['createFactory']>;
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

  // [NN] [ESLINT] temporarily disabling require-await ESLint rule
  // eslint-disable-next-line @typescript-eslint/require-await
  public async startUp() {
    this.serviceInternal = new QueueStorageSeedwork.BaseQueueSenderImpl(this.accountName, this.accountKey);
    return this;
  }

  // [NN] [ESLINT] temporarily disabling require-await ESLint rule
  // eslint-disable-next-line @typescript-eslint/require-await
  public async shutDown() {
    if (!this.serviceInternal) {
      throw new Error("ServiceQueueSender is not started - shutdown cannot proceed");
    }
    console.log("ServiceQueueSender stopped");
  }

  public get service(): QueueSender {
    if (!this.serviceInternal) {
      throw new Error("ServiceQueueSender is not started - cannot access service");
    }
    return this;
  }
    /**
   * Factory method to generate a type-safe API for all registered senders.
   * Usage:
   *   const myQueueApi = ServiceQueueSender.createFactory(queueSender, config);
   *   await myQueueApi.toOutboundExampleQueue(payload);
   */
  public createFactory<T>(config: T): QueueSenderApi<T> {
    const result = {} as Partial<QueueSenderApi<T>>;
    for (const key in config) {
      const reg = config[key] as SenderRegistration<unknown> | undefined;
      if (!reg) {
        throw new Error(`Invalid registration for queue: ${key}`);
      }
      type PayloadType = typeof key extends QueueStorageSeedwork.JSONSchema<infer P> ? P : never;
      result[key] = ((payload: PayloadType, eventId?: string) => this.sendMessageToQueue(reg.queueName, payload, eventId)) as QueueSenderApi<T>[typeof key];
    }
    return result as QueueSenderApi<T>;
  }

  /**
   * Register a sender for a specific queue.
   * @param registration SenderRegistration<TPayload>
   */
  public registerSender<TPayload>(registration: SenderRegistration<TPayload>): void {
    // [NN] [SOURCERY-CHAT] "This is safe because you control both registration and retrieval, and you always cast back to the correct type when retrieving.""
    this.senderRegistry.set(registration.queueName, registration as SenderRegistration<unknown>);
    console.log('ServiceQueueSender | registered sender >', registration.queueName);
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
      sendMessageOutput.messageJson as QueueStorageSeedwork.MessageType<TPayload>,
      registration.extractLogTags ? registration.extractLogTags(sendMessageOutput.messageJson as QueueStorageSeedwork.MessageType<TPayload>) : {},
      registration.extractLogMetadata ? registration.extractLogMetadata(sendMessageOutput.messageJson as QueueStorageSeedwork.MessageType<TPayload>) : {}
    );
  }

  /**
   * Generates a unique event ID using UUID v4.
   */
  private generateEventId(): string {
    return randomUUID();
  }
}





