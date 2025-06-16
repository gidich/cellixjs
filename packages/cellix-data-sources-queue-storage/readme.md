# @cellix/data-sources-queue-storage

This package provides foundational building blocks for working with Azure Storage Queues in the Cellix framework. It includes base classes and types for implementing queue senders and receivers, as well as schema validation utilities for message payloads. This package is intended to be used by higher-level packages and application code that require robust, type-safe, and schema-validated queue operations.

## File Structure

```
cellix-data-sources-queue-storage/
├── src/
│   ├── index.ts                        # Main export: exposes QueueStorageSeedwork
│   └── queue-storage-seedwork/
│       ├── index.ts                    # Exports all seedwork classes and types
│       ├── base-queue-sender.ts        # Base class and types for queue senders
│       ├── base-queue-receiver.ts      # Base class and types for queue receivers
│       └── json-validation.ts          # JSON schema validation utility
├── readme.md                           # This documentation
└── ...
```

## Dependencies

- **@azure/storage-queue**  
  Official Azure SDK for interacting with Azure Storage Queues.
- **ajv**  
  Used for JSON schema validation of message payloads.
- **html-entities**  
  Used for decoding queue message payloads.

## Exports

**QueueStorageSeedwork**

- `BaseQueueSender`  
  Interface for queue sender implementations. Defines the contract for sending and logging messages.
  - `sendMessage<TPayloadType>(queueName, messageSchema, payloadRaw, payloadType, eventId): Promise<SendMessageOutput<TPayloadType>>`  
    Sends a message to the specified queue after validating and preparing the message payload.
  - `logMessage<TPayloadType>(eventId, messageJson, meta, event): void`  
    Generic logging mechanism for queue messages.
    - `meta`: Additional metadata related to the message, such as context or processing information.  
    - `event`: The event object or type associated with the message, providing event-specific details.

- `BaseQueueSenderImpl`  
  Concrete implementation of `BaseQueueSender` for Azure Storage Queues. Handles connection, message preparation, validation, sending, and logging.
  - `constructor(accountName: string, accountKey: string)`  
    Initializes the sender with Azure Storage credentials.
  - `sendMessage<TPayloadType>(...)`  
    See above.
  - `logMessage<TPayloadType>(...)`  
    See above.

- `BaseQueueReceiver`  
  Interface for queue receiver implementations.

- `BaseQueueReceiverImpl<T>`  
  Abstract base class for queue receivers. Handles message parsing and validation.
  - `constructor(messageRaw: string)`  
    Parses and decodes the raw queue message.
  - `protected validateMessage(messageSchema: JSONSchemaType<T>): void`  
    Validates the parsed message against the provided schema.

- `MessageType<TPayloadType>`  
  Type for queue message payloads.
  - This type includes additional metadata fields (such as message headers, IDs, and timestamps) alongside the event payload `TPayloadType`.  

- `PayloadTypeEnum`  
  Enum for categorizing message types (e.g., DOCUMENT_EVENT, BUSINESS_EVENT, REQUEST).

- `JSONSchema<TPayloadType>`  
  Type alias for defining JSON schemas for message validation.
  - Used for typing JSON schemas in the application-specific code

Import example:

```typescript
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';
```

## Example Usage

### Sending a Message

```typescript
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';

const sender = new QueueStorageSeedwork.BaseQueueSenderImpl('accountName', 'accountKey');
const schema: QueueStorageSeedwork.JSONSchema<MyPayloadType> = { /* ... */ };

await sender.sendMessage(
  'my-queue',
  schema,
  { /* payload */ },
  QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
  'event-id-123'
);
```

### Receiving and Validating a Message

```typescript
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';

class MyQueueReceiver extends QueueStorageSeedwork.BaseQueueReceiverImpl<MyPayloadType> {
  constructor(messageRaw: string) {
    super(messageRaw);
    this.validateMessage(mySchema);
    // ...process message
  }
}
```

## Features
- **Type safety**: All message payloads are strongly typed.
- **Schema validation**: Messages are validated against JSON schemas before sending or processing.
- **Extensibility**: Base classes are designed for extension in application-specific queue sender/receiver implementations.

---

For more details, see the source files and follow the established patterns. If you have questions, check the Cellix framework documentation or ask your team lead.

