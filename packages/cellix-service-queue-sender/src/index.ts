import type { ServiceBase } from '@cellix/api-services-spec';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';
import type { BaseQueueSenderImpl } from '@cellix/data-sources-queue-storage/src/queue-storage-seedwork/base-queue-sender.ts';

export interface QueueSenderContext extends QueueStorageSeedwork.BaseQueueSender {
  service: QueueStorageSeedwork.BaseQueueSenderImpl;
}

export class ServiceQueueSender implements ServiceBase<QueueSenderContext>, QueueSenderContext {
  private readonly accountName: string;
  private readonly accountKey: string;
  private serviceInternal: BaseQueueSenderImpl | undefined;
  constructor(accountName: string, accountKey: string) {
    if(!accountName || accountName.trim() === '') {
      throw new Error('Account name is required');
    }
    if(!accountKey || accountKey.trim() === '') {
      throw new Error('Account key is required');
    }
    this.accountName = accountName;
    this.accountKey = accountKey;
  }
  public async startUp()  {
    this.serviceInternal = new QueueStorageSeedwork.BaseQueueSenderImpl(this.accountName, this.accountKey);
    console.log('ServiceQueueSender started');
    return this;
  }
  public async shutDown() {
    if(!this.serviceInternal) {
      throw new Error('ServiceQueueSender is not started - shutdown cannot proceed');
    }
    console.log('ServiceQueueSender stopped');
  }
  public get service() : QueueStorageSeedwork.BaseQueueSenderImpl {
    if(!this.serviceInternal) {
      throw new Error('ServiceQueueSender is not started - cannot access service');
    }
    return this.serviceInternal;
  }
}