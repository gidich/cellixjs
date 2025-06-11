import type { QueueSender, QueueSenderContext, SenderRegistration } from '@cellix/service-queue-sender';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';
import { OutboundQueueNameEnum, OutboundExampleSchema, type OutboundExampleEventPayloadType, type OutboundExamplePayloadType } from './schemas/index.ts';

export const QueueStorage = (initializedService: QueueSenderContext): QueueSender => {
  if (!initializedService?.service) {
    throw new Error('QueueSenderContextFactory is required');
  }

  const config: Array<SenderRegistration<any>> = [
    {
      queueName: OutboundQueueNameEnum.OUTBOUND_EXAMPLE,
      schema: OutboundExampleSchema,
      payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
      extractLogTags: (payload) => ({
        queueName: OutboundQueueNameEnum.OUTBOUND_EXAMPLE,
        requiredField: payload.eventPayload.requiredField
      }),
      extractLogMetadata: (payload) => ({
        eventId: payload.eventId,
        eventTimestamp: payload.eventTimestamp
      }),
    } as SenderRegistration<OutboundExampleEventPayloadType>
  ];

  for (const registration of config) {
    initializedService.service.registerSender<typeof registration>(registration);
  }

  return initializedService.service;
};

export {
  OutboundQueueNameEnum,
  type OutboundExamplePayloadType,
  type OutboundExampleEventPayloadType,
}