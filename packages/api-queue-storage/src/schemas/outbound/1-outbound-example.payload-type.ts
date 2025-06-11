export interface OutboundExampleEventPayloadType {
    requiredField: string;
    optionalField?: string;
}

export interface OutboundExamplePayloadType {
    eventTimestamp: string;
    eventId: string;
    traceParent?: string;
    traceState?: string;
    eventPayload: OutboundExampleEventPayloadType;
}