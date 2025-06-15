export interface OutboundExampleEventPayloadType {
    requiredField: string;
    optionalField: string | undefined;
}

export interface OutboundExamplePayloadType {
    eventTimestamp: string;
    eventId: string;
    traceParent?: string;
    traceState?: string;
    eventPayload: OutboundExampleEventPayloadType;
}