


# Azure Queue Storage Configuration

This module provides configuration and initialization for Azure Queue Storage integration in the API package.

## Queues
- Azure Storage Queues are used for reliable, asynchronous message delivery between services.
- The configuration in `index.ts` sets up the storage account name and key from environment variables, and provides a builder function to initialize the queue sender context with registered senders from the `api-queue-storage` package.

## Configuration (see `index.ts`)
- `storageAccountName` and `storageAccountKey` are loaded from environment variables and must be set for the service to function.
- `queueStorageContextBuilder` is a helper to initialize and register all queue senders for this service.

---
For more details on registering and using queue senders, see the `api-queue-storage` package documentation.

