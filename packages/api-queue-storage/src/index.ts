import type { QueueSenderContext } from '@cellix/service-queue-sender';
import { QueueStorageSeedwork } from '@cellix/data-sources-queue-storage';
import { OutboundQueueNameEnum, OutboundExampleSchema, type OutboundExampleEventPayloadType, type OutboundExamplePayloadType } from './schemas/index.ts';

export const QueueStorage = (initializedService: QueueSenderContext) => {
  // [NN] [ESLINT] commenting this out to avoid ESLint rule @typescript-eslint/no-unnecessary-condition
  // if (!initializedService?.service) {
  //   throw new Error('QueueSenderContextFactory is required');
  // }

  const config = {
    sendMessageToOutboundExampleQueue: {
      queueName: OutboundQueueNameEnum.OUTBOUND_EXAMPLE,
      schema: OutboundExampleSchema,
      payloadType: QueueStorageSeedwork.PayloadTypeEnum.DOCUMENT_EVENT,
      extractLogTags: (payload: QueueStorageSeedwork.MessageType<OutboundExampleEventPayloadType>) => ({
        queueName: OutboundQueueNameEnum.OUTBOUND_EXAMPLE,
        requiredField: payload.eventPayload.requiredField
      }),
      extractLogMetadata: (payload: QueueStorageSeedwork.MessageType<OutboundExampleEventPayloadType>) => ({
        eventId: payload.eventId,
        eventTimestamp: payload.eventTimestamp
      }),
    }
  };

  for (const registration of Object.values(config)) { 
    initializedService.service.registerSender(registration);
  }

  return initializedService.service.createFactory(config);
};

export {
  OutboundQueueNameEnum,
  type OutboundExamplePayloadType,
  type OutboundExampleEventPayloadType,
}