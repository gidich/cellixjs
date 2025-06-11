import type { QueueSender, QueueSenderContextFactory } from '@cellix/service-queue-sender';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';
import { OutboundQueueNameEnum, OutboundExampleSchema, type OutboundExamplePayloadType } from './schemas/index.ts';

export const QueueStorage = (initializedService: QueueSenderContextFactory): QueueSender => {
  if (!initializedService?.service) {
    throw new Error('QueueSenderContextFactory is required');
  }

  initializedService.service
    .registerSender<OutboundExamplePayloadType>({
      queueName: OutboundQueueNameEnum.OUTBOUND_EXAMPLE,
      schema: OutboundExampleSchema,
      payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
      extractLogTags: (payload) => ({
        queueName: OutboundQueueNameEnum.OUTBOUND_EXAMPLE,
        requiredField: payload.eventPayload.requiredField,
      }),
      extractLogMetadata: (payload) => ({
        eventId: payload.eventId,
        eventTimestamp: payload.eventTimestamp
      }),
    });

  return initializedService.service;
};