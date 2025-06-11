import { randomUUID } from 'node:crypto';
import type { ServiceBase } from '@cellix/api-services-spec';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';

export type SenderRegistration<TPayload> = {
  queueName: string;
  schema: QueueStorageSeedwork.JSONSchema<TPayload>;
  payloadType: QueueStorageSeedwork.PayloadTypeEnum;
  extractLogTags?: (payload: QueueStorageSeedwork.MessageType<TPayload>) => Record<string, any>;
  extractLogMetadata?: (payload: QueueStorageSeedwork.MessageType<TPayload>) => Record<string, any>;
};

// export type QueueSenderApi<T extends Record<string, SenderRegistration<any>>> = {
//   [K in keyof T]: (
//     payload: T[K]['schema'] extends QueueStorageSeedwork.JSONSchema<infer P> ? P : never,
//     eventId?: string
//   ) => Promise<void>;
// };
export interface QueueSender {
  registerSender<TPayload>(registration: SenderRegistration<TPayload>): void;
  // createFactory<T extends Record<string, SenderRegistration<any>>>(config: T): QueueSenderApi<T>;
  sendMessageToQueue<TPayload>(queueName: string, payload: TPayload, eventId?: string): Promise<void>;
}
export interface QueueSenderContext {
  service: QueueSender;
  // api: ReturnType<QueueSender['createFactory']>;
}

export class ServiceQueueSender implements ServiceBase<QueueSenderContext>, QueueSenderContext {
  private readonly accountName: string;
  private readonly accountKey: string;
  private serviceInternal: QueueStorageSeedwork.BaseQueueSenderImpl | undefined;
  private readonly senderRegistry: Map<string, SenderRegistration<any>> = new Map();

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

  public async startUp() {
    this.serviceInternal = new QueueStorageSeedwork.BaseQueueSenderImpl(this.accountName, this.accountKey);
    return this;
  }

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
  // public createFactory<T extends Record<string, SenderRegistration<any>>>(config: T): QueueSenderApi<T> {
  //   const result: any = {};
  //   for (const key in config) {
  //     const reg = config[key]!;
  //     const functionName = this.generateRegisteredSenderFunctionName(reg.queueName);
  //     result[functionName] = (payload: any, eventId?: string) => this.sendMessageToQueue(reg.queueName, payload, eventId);
  //   }
  //   return result;
  // }

  /**
   * Register a sender for a specific queue.
   * @param registration SenderRegistration<TPayload>
   */
  public registerSender<TPayload>(registration: SenderRegistration<TPayload>): void {
    this.senderRegistry.set(registration.queueName, registration);
    console.log('ServiceQueueSender | registered sender:', registration.queueName);
  }

  /**
   * Send a message to a registered queue. Looks up the registration by queueName.
   * @param queueName The queue name to send to
   * @param payload The payload to send
   * @param eventId Required eventId for the message
   */
  public async sendMessageToQueue<TPayload>(queueName: string, payload: TPayload, eventId?: string): Promise<void> {
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

  /**
   * Generates a unique event ID using UUID v4.
   */
  private generateEventId(): string {
    return randomUUID();
  }

  /**
   * Generates the registered sender function name based on the queue name.
   * @param queueName The queue name to generate the function name for
   * @returns The generated function name
   */
  // queue name examples: "outbound-example", "request-applicant-data", "applicant", "country"
  // expected output: "sendMessageToOutboundExampleQueue", "sendMessageToRequestApplicantDataQueue", "sendMessageToApplicantQueue", "sendMessageToCountryQueue"
  // private generateRegisteredSenderFunctionName(queueName: string): string {
  //   const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
  //   return `sendMessageTo${queueName
  //     .split("-")
  //     .map((word) => capitalize(word))
  //     .join("")}Queue`;
  // }
}





