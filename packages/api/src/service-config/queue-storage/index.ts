import { type QueueSenderContext } from '@cellix/service-queue-sender';
import { QueueStorage } from '@ocom/api-queue-storage';

const storageAccountName = process.env["STORAGE_ACCOUNT_NAME"] as string; // need to throw an error if this is not set
if (!storageAccountName) {
  throw new Error("Missing required environment variable: STORAGE_ACCOUNT_NAME");
}

const storageAccountKey = process.env["STORAGE_ACCOUNT_KEY"] as string; // need to throw an error if this is not set
if (!storageAccountKey) {
  throw new Error("Missing required environment variable: STORAGE_ACCOUNT_KEY");
}

export { storageAccountName, storageAccountKey };

export const queueStorageContextBuilder = ( initializedService : QueueSenderContext ) => {
  return QueueStorage(initializedService);
}