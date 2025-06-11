import { QueueServiceClient, StorageSharedKeyCredential } from '@azure/storage-queue';
import JsonValidation from './json-validation.ts';
import type { JSONSchemaType } from 'ajv';

interface BaseMessageType {
  eventTimestamp: string;
  eventId: string;
  eventName: string;
  eventType: string;
}
interface EventMessageType<TPayloadType> extends BaseMessageType {
  eventPayload: TPayloadType;
  requestPayload?: never;
}
interface RequestMessageType<TPayloadType> extends BaseMessageType {
  eventPayload?: never;
  requestPayload: TPayloadType;
}
export type MessageType<TPayloadType> = EventMessageType<TPayloadType> | RequestMessageType<TPayloadType>;

export interface SendMessageOutput {
  eventId: string;
  messageJson: any;
}

export const PayloadTypeEnum = {
  DOCUMENT_EVENT: 'DOCUMENT_EVENT',
  BUSINESS_EVENT: 'BUSINESS_EVENT',
  REQUEST: 'REQUEST',
} as const;

export type PayloadTypeEnum = typeof PayloadTypeEnum[keyof typeof PayloadTypeEnum];

export type JSONSchema<TPayloadType> = JSONSchemaType<MessageType<TPayloadType>>;

export interface QueueSenderContextFactory {
//  GetModel: GetModelFunctionWithSchema;

  readonly service: BaseQueueSender;
}

export interface BaseQueueSender {
  sendMessage<TPayloadType>(
    queueName: string,
    messageSchema: JSONSchema<TPayloadType>,
    payloadRaw: TPayloadType,
    payloadType: PayloadTypeEnum,
    eventId: string
  ): Promise<SendMessageOutput>;
  logMessage<TPayloadType>(eventId: string, messageJson: MessageType<TPayloadType>, meta: Record<string, unknown>, event: Record<string, unknown>): void;
}

export class BaseQueueSenderImpl implements BaseQueueSender {
  protected client: QueueServiceClient;

  public constructor(accountName: string, accountKey: string) {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    if (process.env['NODE_ENV'] === 'development') {
      this.client = new QueueServiceClient(`http://127.0.0.1:10001/${accountName}`, sharedKeyCredential);
    } else {
      this.client = new QueueServiceClient(`https://${accountName}.queue.core.windows.net`, sharedKeyCredential);
    }
  }

  private validateMessage<TPayloadType>(messageJson: MessageType<TPayloadType>, messageSchema: JSONSchema<TPayloadType>): void {
    JsonValidation(messageJson, messageSchema);
  }

  private prepareMessageJson<TPayloadType>(queueName: string, payloadJson: TPayloadType, payloadType: PayloadTypeEnum, eventId: string): MessageType<TPayloadType> {
    let message: MessageType<TPayloadType> = {
      eventTimestamp: new Date().toISOString(),
      eventId: eventId,
      eventName: queueName,
      eventType: payloadType,
      eventPayload: payloadJson,
    };
    return message;
  }

  /**
   * Sends a message to the specified queue after validating and preparing the message payload.
   *
   * @typeParam TPayloadType - The type of the message payload.
   * @param queueName - The name of the queue to send the message to.
   * @param messageSchema - The JSON schema used to validate the message payload.
   * @param payloadRaw - The raw payload data to be sent in the message.
   * @param payloadType - The type of the payload, as defined by {@link PayloadTypeEnum}.
   * @param eventId - The unique identifier for the event/message.
   * @returns A promise that resolves to a {@link SendMessageOutput} containing the event ID and the message JSON.
   * @throws {Error} If the message validation fails.
   */
  public async sendMessage<TPayloadType>(
    queueName: string,
    messageSchema: JSONSchema<TPayloadType>,
    payloadRaw: TPayloadType,
    payloadType: PayloadTypeEnum,
    eventId: string
  ): Promise<SendMessageOutput> {
    let payloadJson = JSON.parse(JSON.stringify(payloadRaw));
    let messageJson = this.prepareMessageJson(queueName, payloadJson, payloadType, eventId);
    this.validateMessage<TPayloadType>(messageJson, messageSchema);
    await this.client.getQueueClient(queueName).sendMessage(Buffer.from(JSON.stringify(messageJson)).toString('base64'), { messageTimeToLive: -1 });
    return { eventId: messageJson.eventId, messageJson: messageJson };
  }

  /**
   * Generic logging mechanism for queue messages. This is a placeholder for real logging (e.g., blob storage, OpenTelemetry).
   * @param eventId The event ID for the message
   * @param messageJson The full message JSON sent to the queue
   * @param meta Metadata extracted from the payload (application-specific)
   * @param event Additional event data (application-specific)
   */
  public logMessage<TPayloadType>(eventId: string, messageJson: MessageType<TPayloadType>, meta: Record<string, unknown>, event: Record<string, unknown>): void {
    // Simple placeholder: log to console
    console.log('[QueueLog]', {
      eventId,
      messageJson,
      meta,
      event
    });
  }
}
