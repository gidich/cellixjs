# @ocom/api-queue-storage

This package provides a type-safe, schema-validated, and extensible way to register and send messages to Azure Storage Queues using the Cellix framework. All infrastructure, validation, and logging are abstracted away, so you can focus on defining your business payloads and queue logic.

***Note**: Both this package and the README are still in development. I have not yet fully thought out the implementation for QueueReceivers, but I imagine the application code will belong in this package alongside the QueueSender.*

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

## Dependencies

- **@cellix/data-sources-queue-storage**  
  Provides the foundational queue sender/receiver classes and schema validation utilities.
- **@cellix/service-queue-sender**  
  Supplies the core queue sender service and dynamic API factory for registering and sending messages.

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
   - **Explicitly register your sender with `registerSender` before creating the factory.**
   - Add your sender configuration to the `config` object, then call `registerSender` for each sender, and finally create the factory. Example:
     ```typescript
     const config = {
       sendMessageToMyQueue: {
         queueName: OutboundQueueNameEnum.MY_QUEUE, // add to enum if needed
         schema: MyQueueSchema,
         payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT, // or appropriate type
         extractLogTags: (payload) => ({ /* optional logging tags */ }),
         extractLogMetadata: (payload) => ({ /* optional logging metadata */ })
       },
       // ...other senders
     };

     // Explicitly register each sender
     initializedService.service.registerSender<MyQueuePayloadType>(config.sendMessageToMyQueue);
     // ...register other senders as needed

     return initializedService.service.createFactory(config);
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
4. Register the sender in `src/index.ts` by adding it to the `config` object and explicitly registering it:
   ```typescript
   const config = {
     sendMessageToUserCreated: {
       queueName: OutboundQueueNameEnum.USER_CREATED,
       schema: UserCreatedSchema,
       payloadType: QueueStorageSeedwork.PayloadTypeEnum.BUSINESS_EVENT,
       extractLogTags: (payload) => ({ userId: payload.userId }),
       extractLogMetadata: (payload) => ({ createdAt: payload.createdAt })
     },
     // ...other senders
   };

   // Explicitly register each sender
   initializedService.service.registerSender<UserCreatedPayloadType>(config.sendMessageToUserCreated);
   // ...register other senders as needed

   return initializedService.service.createFactory(config);
   ```

---

## Example: Using the QueueSenderAPI

Once you have registered your queue sender(s), you can use the dynamic API returned by the factory to send messages to your application-specific queues. Each sender you define in the config will be available as a function on the returned `queueSender` object, named according to your config key (e.g., `sendMessageToUserCreated`).

For example, if you registered a sender as `sendMessageToOutboundExampleQueue`, you can send a message like this:

```typescript
// Assume apiContext is an object implementing ApiContextSpec
await apiContext.queueSender.sendMessageToOutboundExampleQueue({
  requiredField: "1234567",
  optionalField: "completed"
});
```

This pattern is used in application code, such as in a GraphQL resolver:

```typescript
// Example from a GraphQL resolver
Mutation: {
  sendMessageToOutboundExampleQueue: async (_parent, args, context) => {
    const { input } = args;
    await context.apiContext.queueSender.sendMessageToOutboundExampleQueue({
      requiredField: input.requiredField,
      optionalField: input.optionalField
    });
    return { success: true };
  }
}
```

This approach allows you to send messages to any registered queue in a type-safe and extensible way, simply by calling the corresponding function on the `queueSender` API.

## Tips
- **Type safety**: TypeScript will enforce that your payload, schema, and registration all match.
- **Validation**: All messages are validated against your schema before being sent.
- **Logging**: Use `extractLogTags` and `extractLogMetadata` for custom log enrichment.
- **Extensibility**: Repeat the above steps to add more queues as needed.

---

For more details, see the existing files and follow the established patterns. If you have questions, check the Cellix framework documentation or ask your team lead.
