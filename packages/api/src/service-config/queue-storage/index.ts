import { type QueueSenderContext } from '@cellix/service-queue-sender';
import { QueueStorage } from '@ocom/api-queue-storage';

const tryGetEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const storageAccountName = tryGetEnvVar("STORAGE_ACCOUNT_NAME");
const storageAccountKey = tryGetEnvVar("STORAGE_ACCOUNT_KEY");

export { storageAccountName, storageAccountKey };

export const queueStorageContextBuilder = ( initializedService : QueueSenderContext ) => {
  return QueueStorage(initializedService);
}