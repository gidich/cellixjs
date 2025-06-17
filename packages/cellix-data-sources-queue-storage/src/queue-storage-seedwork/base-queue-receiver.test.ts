import { describe, expect, it } from 'vitest';
import { encode } from 'html-entities';
import type { JSONSchemaType } from 'ajv';
import { BaseQueueReceiverImpl } from './base-queue-receiver.ts';


interface TestMessage {
  foo: string;
  bar?: number;
}

const schema: JSONSchemaType<TestMessage> = {
  type: 'object',
  properties: {
    foo: { type: 'string' },
    bar: { type: 'number', nullable: true },
  },
  required: ['foo'],
  additionalProperties: false,
};

class TestQueueReceiver extends BaseQueueReceiverImpl<TestMessage> {
  public getMessage(): TestMessage {
    return this.messageJson;
  }

  public validate(schema: JSONSchemaType<TestMessage>): void {
    this.validateMessage(schema);
  }
}

describe('BaseQueueReceiverImpl', () => {

  it('parses and decodes the raw message JSON', () => {
    // Arrange
    const rawMessage = encode(JSON.stringify({ foo: 'hello', bar: 42 }));

    // Act
    const receiver = new TestQueueReceiver(rawMessage);

    // Assert
    expect(receiver.getMessage()).toEqual({ foo: 'hello', bar: 42 });
  });


  it('validates the message against the schema', () => {
    // Arrange
    const rawMessage = encode(JSON.stringify({ foo: 'hello', bar: 42 }));
    const receiver = new TestQueueReceiver(rawMessage);

    // Act
    const act = () => { receiver.validate(schema); };

    // Assert
    expect(act).not.toThrow();
  });


  it('throws on invalid message', () => {
    // Arrange
    const raw = encode(JSON.stringify({ bar: 123 }));
    const receiver = new TestQueueReceiver(raw);

    // Act
    const act = () => { receiver.validate(schema); };

    // Assert
    expect(act).toThrow();
  });


  it('validates message with only required property', () => {
    // Arrange
    const raw = encode(JSON.stringify({ foo: 'requiredOnly' }));
    const receiver = new TestQueueReceiver(raw);

    // Act
    const act = () => { receiver.validate(schema); };

    // Assert
    expect(act).not.toThrow();
  });


  it('throws if foo is wrong type', () => {
    // Arrange
    const raw = encode(JSON.stringify({ foo: 123, bar: 42 }));
    const receiver = new TestQueueReceiver(raw);

    // Act
    const act = () => { receiver.validate(schema); };

    // Assert
    expect(act).toThrow();
  });


  it('throws if additional property is present', () => {
    // Arrange
    const raw = encode(JSON.stringify({ foo: 'ok', extra: true }));
    const receiver = new TestQueueReceiver(raw);

    // Act
    const act = () => { receiver.validate(schema); };

    // Assert
    expect(act).toThrow();
  });


  it('throws if message is empty object', () => {
    // Arrange
    const raw = encode(JSON.stringify({}));
    const receiver = new TestQueueReceiver(raw);

    // Act
    const act = () => { receiver.validate(schema); };

    // Assert
    expect(act).toThrow();
  });


  it('throws if message is null', () => {
    // Arrange
    const raw = encode(JSON.stringify(null));
    const receiver = new TestQueueReceiver(raw);

    // Act
    const act = () => { receiver.validate(schema); };

    // Assert
    expect(act).toThrow();
  });

  it('throws if message is undefined', () => {
    // Arrange
    // JSON.stringify(undefined) returns undefined, so we must handle this edge case
    const raw = encode('undefined');
    // This will throw in JSON.parse, so we need to catch that
    const act = () => new TestQueueReceiver(raw);

    // Assert
    expect(act).toThrow(/Failed to parse message JSON/);
  });


  it('throws if schema is undefined', () => {
    // Arrange
    const raw = encode(JSON.stringify({ foo: 'test' }));
    const receiver = new TestQueueReceiver(raw);

    // Act
    // @ts-expect-error: purposely passing undefined
    const act = () => { receiver.validate(undefined); };

    // Assert
    expect(act).toThrow();
  });


  it('throws if schema is missing required fields', () => {
    // Arrange
    const incompleteSchema = {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false
    } as unknown as JSONSchemaType<TestMessage>;
    const raw = encode(JSON.stringify({ foo: 'test' }));
    const receiver = new TestQueueReceiver(raw);

    // Act
    const act = () => { receiver.validate(incompleteSchema); };

    // Assert
    expect(act).toThrow();
  });

});