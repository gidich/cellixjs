import type { ServiceBase } from '@cellix/api-services-spec';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';

export type SenderRegistration<TPayload> = {
  queueName: string;
  schema: QueueStorageSeedwork.JSONSchema<TPayload>;
  payloadType: QueueStorageSeedwork.PayloadTypeEnum;
  extractLogTags?: (payload: TPayload) => Record<string, any>;
  extractLogMetadata?: (payload: TPayload) => Record<string, any>;
};
export interface QueueSender {
  registerSender<TPayload>(registration: SenderRegistration<TPayload>): void;
  sendMessageToQueue<TPayload>(queueName: string, payload: TPayload, eventId: string): Promise<void>;
}
export interface QueueSenderContextFactory {
  service: QueueSender;
}

export class ServiceQueueSender implements ServiceBase<QueueSenderContextFactory>, QueueSenderContextFactory {
  private readonly accountName: string;
  private readonly accountKey: string;
  private serviceInternal: QueueStorageSeedwork.BaseQueueSenderImpl | undefined;
  private readonly senderRegistry: Map<string, SenderRegistration<any>> = new Map();

  constructor(accountName: string, accountKey: string) {
    if (!accountName || accountName.trim() === '') {
      throw new Error('Account name is required');
    }
    if (!accountKey || accountKey.trim() === '') {
      throw new Error('Account key is required');
    }
    this.accountName = accountName;
    this.accountKey = accountKey;
  }

  public async startUp() {
    this.serviceInternal = new QueueStorageSeedwork.BaseQueueSenderImpl(this.accountName, this.accountKey);
    console.log('ServiceQueueSender started');
    return this;
  }

  public async shutDown() {
    if (!this.serviceInternal) {
      throw new Error('ServiceQueueSender is not started - shutdown cannot proceed');
    }
    console.log('ServiceQueueSender stopped');
  }

  public get service(): QueueSender {
    if (!this.serviceInternal) {
      throw new Error('ServiceQueueSender is not started - cannot access service');
    }
    return this;
  }

  /**
   * Register a sender for a specific queue.
   * @param registration SenderRegistration<TPayload>
   */
  public registerSender<TPayload>(registration: SenderRegistration<TPayload>): void {
    this.senderRegistry.set(registration.queueName, registration);
  }

  /**
   * Send a message to a registered queue. Looks up the registration by queueName.
   * @param queueName The queue name to send to
   * @param payload The payload to send
   * @param eventId Required eventId for the message
   */
  public async sendMessageToQueue<TPayload>(queueName: string, payload: TPayload, eventId: string): Promise<void> {
    if (!this.serviceInternal) {
      throw new Error('ServiceQueueSender is not started - cannot send message');
    }
    const registration = this.senderRegistry.get(queueName) as SenderRegistration<TPayload> | undefined;
    if (!registration) {
      throw new Error(`No sender registered for queue: ${queueName}`);
    }
    if (!eventId) {
      throw new Error('eventId is required and must be provided by the consumer');
    }
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
      registration.extractLogTags ? registration.extractLogTags(payload) : {},
      registration.extractLogMetadata ? registration.extractLogMetadata(payload) : {}
    );
  }
}





