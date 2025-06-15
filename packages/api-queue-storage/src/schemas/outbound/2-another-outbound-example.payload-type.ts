interface AnotherOutboundExampleEventPayloadPersonalInformationType {
    firstName: string;
    lastName: string;
    email: string | undefined; // Optional field
    phoneNumber: string | undefined; // Optional field
}

export interface AnotherOutboundExampleEventPayloadType {
    userId: string;
    personalInformation: AnotherOutboundExampleEventPayloadPersonalInformationType;

}

export interface AnotherOutboundExamplePayloadType {
    eventTimestamp: string;
    eventId: string;
    traceParent?: string;
    traceState?: string;
    eventPayload: AnotherOutboundExampleEventPayloadType;
}