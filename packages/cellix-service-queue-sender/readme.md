# @cellix/service-queue-sender

This package provides a type-safe, extensible service for sending messages to Azure Storage Queues in the Cellix framework. It implements the `ServiceQueueSender` class, which builds on the base queue sender utilities and integrates with the Cellix service lifecycle. This package is intended for use in application and infrastructure code that needs to register, manage, and send messages to multiple queues with strong typing and schema validation.

## File Structure

```
cellix-service-queue-sender/
├── src/
│   ├── index.ts                        # Main export: ServiceQueueSender and related types
├── readme.md                           # This documentation
└── ...
```

## Dependencies

- **@cellix/data-sources-queue-storage**  
  Provides the foundational queue sender/receiver classes and schema validation utilities.
- **@cellix/api-services-spec**  
  Supplies the `ServiceBase` interface for service lifecycle integration.
- **node:crypto**  
  Used for generating unique event IDs (via `randomUUID`).

## Exports

- `ServiceQueueSender`  
  Main class for managing and sending messages to Azure Storage Queues. Implements the Cellix `ServiceBase` lifecycle and the `QueueSender` API.
  - `constructor(accountName: string, accountKey: string)`  
    Initializes the sender with Azure Storage credentials.
  - `startUp(): Promise<ServiceQueueSender>`  
    Starts the service and prepares the internal sender.
  - `shutDown(): Promise<void>`  
    Stops the service.
  - `registerSender<TPayload>(registration: SenderRegistration<TPayload>): void`  
    Registers a sender for a specific queue.
  - `createFactory<T extends object>(config: T): QueueSenderApi<T>`  
    Generates a type-safe API for all registered senders based on the provided config.
  - `service: QueueSender`  
    Returns the service interface for registering senders and creating factories.

- `SenderRegistration<TPayload>`  
  Type describing the configuration for a queue sender, including queue name, schema, payload type, and optional log extraction functions.

- `QueueSenderApi<T>`  
  Type describing the dynamic API generated for sending messages to queues, based on the config object.

- `QueueSender`  
  Interface for registering senders and creating the sender API factory.

- `QueueSenderContext`  
  Interface describing the service context, exposing the `service` property.

Import example:

```typescript
import { ServiceQueueSender } from '@cellix/service-queue-sender';
```

## Example Usage

### Registering and Using a Queue Sender

```typescript
import { ServiceQueueSender } from '@cellix/service-queue-sender';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';

// 1. Create the service
const senderService = new ServiceQueueSender('accountName', 'accountKey');
await senderService.startUp();

// 2. Register a sender
senderService.registerSender({
  queueName: 'my-queue',
  schema: mySchema, // must be a JSONSchema matching your payload
  payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
  extractLogTags: (payload) => ({ myTag: payload.eventPayload.myField }),
  extractLogMetadata: (payload) => ({ timestamp: payload.eventTimestamp })
});

// 3. Create a type-safe API for sending messages
const api = senderService.createFactory({
  sendMessageToMyQueue: {
    queueName: 'my-queue',
    schema: mySchema,
    payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT
  }
});

// 4. Send a message
await api.sendMessageToMyQueue({
  myField: 'value',
  // ...other fields
});

await senderService.shutDown();
```

## Features
- **Type safety**: All queue senders and payloads are strongly typed.
- **Schema validation**: Messages are validated against JSON schemas before being sent.
- **Dynamic API**: Easily generate a type-safe API for all registered senders.
- **Extensibility**: Register multiple senders for different queues and customize logging.
- **Service lifecycle**: Integrates with the Cellix service lifecycle for startup and shutdown.

---

For more details, see the source files and follow the established patterns. If you have questions, check the Cellix framework documentation or ask your team lead.
