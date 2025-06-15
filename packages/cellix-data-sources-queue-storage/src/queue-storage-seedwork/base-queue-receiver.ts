import JsonValidation from './json-validation.ts';
import { type JSONSchemaType } from 'ajv';
import { decode } from 'html-entities';

// [NN] [ESLINT] commenting this out to avoid ESLint rule @typescript-eslint/no-empty-object-type
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseQueueReceiver {}

export abstract class BaseQueueReceiverImpl<T> implements BaseQueueReceiver {
    protected messageJson: T;

    constructor(messageRaw: string) {
        this.messageJson = JSON.parse(decode(messageRaw)) as T;
    }

    protected validateMessage(messageSchema: JSONSchemaType<T>): void {
        JsonValidation(this.messageJson, messageSchema);
    }
}

