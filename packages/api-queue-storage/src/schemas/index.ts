
// *********** Inbound Queues *********** //
// Update the queue names as per your requirements
export const InboundQueueNameEnum = {} as const;

// *********** Outbound Queues *********** //
// Update the queue names as per your requirements
export const OutboundQueueNameEnum = {
  OUTBOUND_EXAMPLE: 'outbound-example',
  ANOTHER_OUTBOUND_EXAMPLE: 'another-outbound-example',
} as const;

// *************** QUEUES *************** //
export type InboundQueueNameEnum = typeof InboundQueueNameEnum[keyof typeof InboundQueueNameEnum];
export type OutboundQueueNameEnum = typeof OutboundQueueNameEnum[keyof typeof OutboundQueueNameEnum];

// *************** SCHEMAS *************** //
export { OutboundExampleSchema } from './outbound/1-outbound-example.schema.ts';
export type { OutboundExampleEventPayloadType, OutboundExamplePayloadType } from './outbound/1-outbound-example.payload-type.ts';

export { AnotherOutboundExampleSchema } from './outbound/2-another-outbound-example.schema.ts';
export type { AnotherOutboundExampleEventPayloadType, AnotherOutboundExamplePayloadType } from './outbound/2-another-outbound-example.payload-type.ts';