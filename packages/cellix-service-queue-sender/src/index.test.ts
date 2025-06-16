import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ServiceQueueSender, type SenderRegistration } from './index.ts';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';

const DUMMY_ACCOUNT_NAME = 'account';
const DUMMY_ACCOUNT_KEY = 'key';

const dummySchema: QueueStorageSeedwork.JSONSchema<{ foo: string }> = {
  type: 'object',
  properties: {
    eventPayload: {
      type: 'object',
      properties: {
        foo: { type: 'string' },
      },
      required: ['foo'],
      additionalProperties: false,
    },
    eventId: { type: 'string' },
    eventTimestamp: { type: 'string', format: 'date-time' },
    eventName: { type: 'string' },
    eventType: { type: 'string' }
  },
  required: ['eventPayload', 'eventId', 'eventTimestamp', 'eventName', 'eventType'],
  additionalProperties: false,
} as const;

const dummyRegistration: SenderRegistration<{ foo: string }> = {
  queueName: 'test-queue',
  schema: dummySchema,
  payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
  extractLogTags: vi.fn().mockReturnValue({ tag: 'test' }),
  extractLogMetadata: vi.fn().mockReturnValue({ meta: 'test' })
};

describe('ServiceQueueSender', () => {
  let sender: ServiceQueueSender;
  let mockSendMessage: ReturnType<typeof vi.fn>;
  let mockLogMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sender = new ServiceQueueSender(DUMMY_ACCOUNT_NAME, DUMMY_ACCOUNT_KEY);

    // Mock BaseQueueSenderImpl and its methods
    mockSendMessage = vi.fn().mockResolvedValue({
      eventId: 'event-1',
      messageJson: { foo: 'bar' }
    });
    mockLogMessage = vi.fn();

    // Patch the internal sender after startUp
    vi.spyOn(QueueStorageSeedwork, 'BaseQueueSenderImpl').mockImplementation(() => ({
      sendMessage: mockSendMessage,
      logMessage: mockLogMessage,
    }) as unknown as QueueStorageSeedwork.BaseQueueSenderImpl);
  });

  it('throws if account name is missing', () => {
    // Act & Assert
    expect(() => new ServiceQueueSender('', DUMMY_ACCOUNT_KEY)).toThrow('Account name is required');
  });

  it('throws if account key is missing', () => {
    // Act & Assert
    expect(() => new ServiceQueueSender(DUMMY_ACCOUNT_NAME, '')).toThrow('Account key is required');
  });

  it('startUp initializes serviceInternal', async () => {
    // Act
    await sender.startUp();

    // Assert
    expect(sender['serviceInternal']).toBeDefined();
  });

  it('shutDown throws if not started', () => {
    // Act & Assert
    expect(() => sender.shutDown()).toThrow('ServiceQueueSender is not started - shutdown cannot proceed');
  });

  it('shutDown logs and resolves if started', async () => {
    // Arrange
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await sender.startUp();

    // Act
    await expect(sender.shutDown()).resolves.toBeUndefined();

    // Assert
    expect(logSpy).toHaveBeenCalledWith('ServiceQueueSender stopped');
    logSpy.mockRestore();
  });

  it('registerSender adds to registry and logs', () => {
    // Arrange
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Act
    sender.registerSender(dummyRegistration);

    // Assert
    expect(sender['senderRegistry'].get(dummyRegistration.queueName)).toBeDefined();
    expect(logSpy).toHaveBeenCalledWith('ServiceQueueSender | registered sender >', dummyRegistration.queueName);
    logSpy.mockRestore();
  });

  it('registerSender does not add duplicate registrations', () => {
    // Arrange
    sender.registerSender(dummyRegistration);
    const logSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const duplicateRegistration: SenderRegistration<{ foo: string }> = {
      queueName: 'test-queue',
      schema: dummySchema,
      payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
      extractLogTags: vi.fn(),
      extractLogMetadata: vi.fn()
    };

    // Act
    sender.registerSender(duplicateRegistration);

    // Assert
    expect(sender['senderRegistry'].size).toBe(1); // Should still be 1
    expect(logSpy).toHaveBeenCalledWith(
      'ServiceQueueSender | sender for queue "test-queue" is already registered. Duplicate registration is ignored.'
    );
    logSpy.mockRestore();
  });

  it('createFactory throws if config is missing registration', async () => {
    // Arrange
    await sender.startUp();

    // Act & Assert
    expect(() => sender.createFactory({ missing: undefined })).toThrow(/Invalid registration for queue/);
  });

  it('createFactory returns API with working method', async () => {
    // Arrange
    await sender.startUp();
    sender.registerSender(dummyRegistration);

    const config = { send: dummyRegistration };
    const api = sender.createFactory(config);

    // Act
    await expect(api.send({ foo: 'bar' }, 'event-123')).resolves.toBeUndefined();

    // Assert
    expect(mockSendMessage).toHaveBeenCalledWith(
      'test-queue',
      dummySchema,
      { foo: 'bar' },
      QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
      'event-123'
    );
    expect(mockLogMessage).toHaveBeenCalled();
  });

  it('sendMessageToQueue throws if not started', async () => {
    // Act & Assert
    await expect(sender['sendMessageToQueue']('test-queue', { foo: 'bar' }, 'event-1')).rejects.toThrow(/not started/);
  });

  it('sendMessageToQueue throws if queue not registered', async () => {
    // Arrange
    await sender.startUp();

    // Act & Assert
    await expect(sender['sendMessageToQueue']('not-registered', { foo: 'bar' }, 'event-1')).rejects.toThrow(/No sender registered/);
  });

  it('sendMessageToQueue works without extractLogTags and extractLogMetadata', async () => {
    // Arrange
    await sender.startUp();
    // Register a sender without extractLogTags or extractLogMetadata
    sender.registerSender({
      queueName: 'no-extract',
      schema: dummySchema,
      payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
      // no extractLogTags, no extractLogMetadata
    });

    // Act
    await sender['sendMessageToQueue']('no-extract', { foo: 'bar' }, 'event-1');

    // Assert
    expect(mockSendMessage).toHaveBeenCalledWith(
      'no-extract',
      dummySchema,
      { foo: 'bar' },
      QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
      'event-1'
    );
    expect(mockLogMessage).toHaveBeenCalledWith(
      'event-1',
      { foo: 'bar' }, // messageJson
      {}, // logTags fallback
      {}  // logMetadata fallback
    );
  });

  it('sendMessageToQueue calls generateEventId if eventId is not provided (real method)', async () => {
    // Arrange
    await sender.startUp();
    sender.registerSender(dummyRegistration);

    // Act
    await sender['sendMessageToQueue']('test-queue', { foo: 'bar' });

    // Assert
    expect(mockSendMessage).toHaveBeenCalledWith(
      'test-queue',
      dummySchema,
      { foo: 'bar' },
      QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
      expect.any(String) // Should be a generated UUID
    );
  });

  it('generateEventId returns a valid UUID', () => {
    // Act
    const eventId = sender['generateEventId']();

    // Assert
    expect(typeof eventId).toBe('string');
    expect(eventId).toMatch(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/);
  });

  it('service getter throws if not started', () => {
    // Act & Assert
    expect(() => sender.service).toThrow(/not started/);
  });

  it('service getter returns self if started', async () => {
    // Arrange
    await sender.startUp();

    // Act
    const svc = sender.service;

    // Assert
    expect(svc).toBe(sender);
  });


});