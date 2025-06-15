import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { JSONSchemaType } from 'ajv';
import { BaseQueueSenderImpl, PayloadTypeEnum, type MessageType } from './base-queue-sender.ts';

interface TestPayload {
  foo: string;
  bar?: number;
}
const schema: JSONSchemaType<MessageType<TestPayload>> = {
  type: 'object',
  properties: {
    eventTimestamp: { type: 'string' },
    eventId: { type: 'string' },
    eventName: { type: 'string' },
    eventType: { type: 'string' },
    eventPayload: {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: { type: 'number', nullable: true }
      },
      required: ['foo'],
      additionalProperties: false
    }
  },
  required: ['eventTimestamp', 'eventId', 'eventName', 'eventType', 'eventPayload'],
  additionalProperties: false
};

const validPayload: TestPayload = { foo: 'test', bar: 42 };
const invalidPayload = { bar: 123 } as unknown as TestPayload; // Missing required 'foo' property

const ACCOUNT_NAME = 'devstoreaccount1';
const ACCOUNT_KEY = 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==';

const QUEUE_NAME = 'test-queue';

describe('BaseQueueSenderImpl', () => {
  let sender: BaseQueueSenderImpl;
  let mockSendMessage: ReturnType<typeof vi.fn>;
  let mockGetQueueClient: ReturnType<typeof vi.fn>;
  let mockQueueClient: unknown;

  beforeEach(async () => {
    // Arrange
    mockSendMessage = vi.fn().mockResolvedValue(undefined)
    mockQueueClient = { sendMessage: mockSendMessage };
    mockGetQueueClient = vi.fn().mockReturnValue(mockQueueClient);

    // Patch the QueueServiceClient prototype for this test
    vi.stubGlobal('process', { env: { NODE_ENV: 'development' } });
    const { QueueServiceClient } = await import('@azure/storage-queue');
    vi.spyOn(QueueServiceClient.prototype, 'getQueueClient').mockImplementation(mockGetQueueClient);

    sender = new BaseQueueSenderImpl(ACCOUNT_NAME, ACCOUNT_KEY);
    // Patch the client instance to use our mock
    sender['client'].getQueueClient = mockGetQueueClient;
  });

  it('sends a valid message and returns expected output', async () => {
    // Act
    const result = await sender.sendMessage(
      QUEUE_NAME,
      schema,
      validPayload,
      PayloadTypeEnum.DOCUMENT_EVENT,
      'event-001'
    );

    // Assert
    expect(mockGetQueueClient).toHaveBeenCalledWith(QUEUE_NAME);
    expect(mockSendMessage).toHaveBeenCalledOnce();
    expect(result.eventId).toBe('event-001');
  });

  it('throws if the payload is invalid', async () => {
    // Act
    const act = async () => {
      await sender.sendMessage(
        QUEUE_NAME,
        schema,
        invalidPayload,
        PayloadTypeEnum.DOCUMENT_EVENT,
        'event-002'
      );
    };

    // Assert
    await expect(act).rejects.toThrow('Data is not valid');
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('encodes the message as base64', async () => {

    // Act
    await sender.sendMessage(
      QUEUE_NAME,
      schema,
      validPayload,
      PayloadTypeEnum.DOCUMENT_EVENT,
      'event-789'
    );

    // Assert
    const call = mockSendMessage.mock.calls[0];
    expect(call).toBeDefined();
    if (!call) { throw new Error('mockSendMessage was not called'); }
    const sentMessage: string = call[0] as string;
    const decoded = JSON.parse(Buffer.from(sentMessage, 'base64').toString('utf-8')) as MessageType<TestPayload>;
    expect(decoded.eventPayload).toEqual(validPayload);
  });

  it('uses the correct queue endpoint for local development', () => {
    // Assert
    expect(sender['client'].url).toContain('http://127.0.0.1:10001/devstoreaccount1');
  });

  it('uses the correct queue endpoint for deployed environments', () => {
    // Arrange
    vi.stubGlobal('process', { env: { NODE_ENV: 'production' } });
    const prodSender = new BaseQueueSenderImpl(ACCOUNT_NAME, ACCOUNT_KEY);

    // Assert
    expect(prodSender['client'].url).toContain(`https://${ACCOUNT_NAME}.queue.core.windows.net`);
  });

  it('calls logMessage and logs to console', () => {
    // Arrange
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const messageJson = {
      eventTimestamp: new Date().toISOString(),
      eventId: 'event-999',
      eventName: QUEUE_NAME,
      eventType: PayloadTypeEnum.DOCUMENT_EVENT,
      eventPayload: validPayload
    };

    // Act
    sender.logMessage('event-999', messageJson, { meta: 1 }, { event: 2 });

    // Assert
    expect(spy).toHaveBeenCalledWith('[QueueLog]', expect.objectContaining({
      eventId: 'event-999',
      messageJson,
      meta: { meta: 1 },
      event: { event: 2 }
    }));

    spy.mockRestore();
  });

  it('throws if messageSchema is undefined', async () => {
    // Act
    // @ts-expect-error: purposely passing undefined
    const act = () => sender.sendMessage(QUEUE_NAME, undefined, validPayload, PayloadTypeEnum.DOCUMENT_EVENT, 'event-000');

    // Assert
    await expect(act()).rejects.toThrow();
  });

  it('throws if payloadRaw is undefined', async () => {
    // Act
    // @ts-expect-error: purposely passing undefined
    const act = () => sender.sendMessage(QUEUE_NAME, schema, undefined, PayloadTypeEnum.DOCUMENT_EVENT, 'event-000');

    // Assert
    await expect(act()).rejects.toThrow();
  });

  it('throws if eventId is missing', async () => {
    // Act
    // @ts-expect-error: purposely passing undefined
    const act = () => sender.sendMessage(QUEUE_NAME, schema, validPayload, PayloadTypeEnum.DOCUMENT_EVENT, undefined);

    // Assert
    await expect(act()).rejects.toThrow();
  });

  it('throws if queueName is missing', async () => {
    // Act
    // @ts-expect-error: purposely passing undefined
    const act = () => sender.sendMessage(undefined, schema, validPayload, PayloadTypeEnum.DOCUMENT_EVENT, 'event-000');

    // Assert
    await expect(act()).rejects.toThrow();
  });

  it('throws if payloadType is missing', async () => {
    // Act
    // @ts-expect-error: purposely passing undefined
    const act = () => sender.sendMessage(QUEUE_NAME, schema, validPayload, undefined, 'event-000');

    // Assert
    await expect(act()).rejects.toThrow();
  });

});