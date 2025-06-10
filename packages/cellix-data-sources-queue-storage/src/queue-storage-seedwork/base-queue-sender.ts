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

type JSONSchema<TPayloadType> = JSONSchemaType<MessageType<TPayloadType>>;

export interface BaseQueueSender {}

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

  protected async sendMessage<TPayloadType>(
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
}
