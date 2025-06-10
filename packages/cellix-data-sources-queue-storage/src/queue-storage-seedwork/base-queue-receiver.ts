import JsonValidation from './json-validation.ts';
import { type JSONSchemaType } from 'ajv';
import { decode } from 'html-entities';

export interface BaseQueueReceiver {}

export abstract class BaseQueueReceiverImpl<T> implements BaseQueueReceiver {
    protected messageJson: T;

    constructor(messageRaw: string) {
        this.messageJson = JSON.parse(decode(messageRaw));
    }

    protected validateMessage(messageSchema: JSONSchemaType<T>): void {
        JsonValidation(this.messageJson, messageSchema);
    }
}

