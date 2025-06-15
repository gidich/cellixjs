# api-queue-storage

This package provides a type-safe, schema-validated, and extensible way to register and send messages to Azure Storage Queues using the Cellix framework. All infrastructure, validation, and logging are abstracted away, so you can focus on defining your business payloads and queue logic.

***Note**: Both this package and the README are still in development. I have not yet fully thought out the implementation for QueueReceivers yet, but I imagine the application code will belong in this package alongside the QueueSender.*

## File Structure

```
api-queue-storage/
├── src/
│   ├── index.ts                        # Entry point: registers queue senders
│   └── schemas/
│       ├── index.ts                    # Exports all schemas and queue name enums
│       └── outbound/
│           ├── 11-request-applicant-data.schema.ts      # AJV schema for a specific queue
│           └── 11-request-applicant-data.payload-type.ts # TypeScript type for the payload
├── readme.md                           # This documentation
└── ...
```

## Purpose

- **Abstracts** Azure queue infrastructure, schema validation, and logging.
- **Enforces** type safety and schema validation for all queue messages.
- **Enables** easy registration of new queue senders with minimal boilerplate.

## How to Register a New Queue Sender

1. **Define your payload type**
   - Create a new file in `src/schemas/outbound/`, e.g. `my-queue.payload-type.ts`:
     ```typescript
     export interface MyQueuePayloadType {
       // your fields here
     }
     ```

2. **Define your AJV schema**
   - Create a new file in `src/schemas/outbound/`, e.g. `my-queue.schema.ts`:
     ```typescript
     import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';
     import type { MyQueuePayloadType } from './my-queue.payload-type.ts';

     export const MyQueueSchema: QueueStorageSeedwork.JSONSchema<MyQueuePayloadType> = {
       $schema: "https://json-schema.org/draft/2020-12/schema",
       type: "object",
       properties: {
         // your fields here
       },
       required: [/* your required fields */],
       additionalProperties: false
     };
     ```

3. **Export your schema and type**
   - In `src/schemas/index.ts`, export your new schema and type:
     ```typescript
     export { MyQueueSchema } from './outbound/my-queue.schema.ts';
     export { type MyQueuePayloadType } from './outbound/my-queue.payload-type.ts';
     ```

4. **Register the sender in `src/index.ts`**
   - Add a registration block:
     ```typescript
     initializedService.service.registerSender<MyQueuePayloadType>({
       queueName: OutboundQueueNameEnum.MY_QUEUE, // add to enum if needed
       schema: MyQueueSchema,
       payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT, // or appropriate type
       extractLogTags: (payload) => ({ /* optional logging tags */ }),
       extractLogMetadata: (payload) => ({ /* optional logging metadata */ })
     });
     ```

5. **(Optional) Add your queue name to the enum**
   - In `src/schemas/index.ts`, add your queue name to `OutboundQueueNameEnum`:
     ```typescript
     export const OutboundQueueNameEnum = {
       ...,
       MY_QUEUE: 'my-queue',
     } as const;
     ```

## Example: Registering a New Queue Sender

Suppose you want to send messages to a queue named `user-created`:

1. Create `user-created.payload-type.ts` and `user-created.schema.ts` in `src/schemas/outbound/`.
2. Export them in `src/schemas/index.ts`.
3. Add `USER_CREATED: 'user-created'` to `OutboundQueueNameEnum`.
4. Register the sender in `src/index.ts`:
   ```typescript
   initializedService.service.registerSender<UserCreatedPayloadType>({
     queueName: OutboundQueueNameEnum.USER_CREATED,
     schema: UserCreatedSchema,
     payloadType: QueueStorageSeedwork.PayloadTypeEnum.BUSINESS_EVENT,
     extractLogTags: (payload) => ({ userId: payload.userId }),
     extractLogMetadata: (payload) => ({ createdAt: payload.createdAt })
   });
   ```

## Tips
- **Type safety**: TypeScript will enforce that your payload, schema, and registration all match.
- **Validation**: All messages are validated against your schema before being sent.
- **Logging**: Use `extractLogTags` and `extractLogMetadata` for custom log enrichment.
- **Extensibility**: Repeat the above steps to add more queues as needed.

---

For more details, see the existing files and follow the established patterns. If you have questions, check the Cellix framework documentation or ask your team lead.
