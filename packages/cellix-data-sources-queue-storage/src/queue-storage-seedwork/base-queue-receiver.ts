import type { JSONSchemaType } from 'ajv';
import JsonValidation from './json-validation.ts';
import { decode } from 'html-entities';

// [NN] [ESLINT] commenting this out to avoid ESLint rule @typescript-eslint/no-empty-object-type
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseQueueReceiver {}

export abstract class BaseQueueReceiverImpl<T> implements BaseQueueReceiver {
    protected messageJson: T;

    constructor(messageRaw: string) {
        const decoded = decode(messageRaw);
        const jsonStr = Buffer.from(decoded, 'base64').toString('utf-8');
        this.messageJson = JSON.parse(jsonStr) as T;
    }

    protected validateMessage(messageSchema: JSONSchemaType<T>): void {
        JsonValidation(this.messageJson, messageSchema);
    }
}

