import type { JSONSchemaType } from 'ajv';
import validateJson from './json-validation.ts';
import { decode } from 'html-entities';

// [NN] [ESLINT] commenting this out to avoid ESLint rule @typescript-eslint/no-empty-object-type
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseQueueReceiver {}

export abstract class BaseQueueReceiverImpl<T> implements BaseQueueReceiver {
    protected messageJson: T;

    constructor(messageRaw: string) {
      try {
          this.messageJson = JSON.parse(decode(messageRaw)) as T;
      } catch (error) {
          throw new Error(`Failed to parse message JSON. Raw base64-decoded payload: ${messageRaw}. Error: ${(error as Error).message}`);
      }
    }

    protected validateMessage(messageSchema: JSONSchemaType<T>): void {
        validateJson(this.messageJson, messageSchema);
    }
}

