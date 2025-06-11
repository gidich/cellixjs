import { type QueueSenderContextFactory } from '@cellix/service-queue-sender';
import { QueueStorage } from '@ocom/api-queue-storage';

export const storageAccountName:string = process.env["STORAGE_ACCOUNT_NAME"] ?? ""; // need to throw an error if this is not set
export const storageAccountKey:string = process.env["STORAGE_ACCOUNT_KEY"] ?? ""; // need to throw an error if this is not set

export const queueStorageContextBuilder = ( initializedService : QueueSenderContextFactory ) => {
  return QueueStorage(initializedService);
}