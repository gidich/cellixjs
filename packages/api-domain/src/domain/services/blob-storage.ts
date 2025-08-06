
export interface BlobStorage {
    createValetKey(storageAccount: string, path: string, expiration: Date): Promise<string>;
}