import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueueStorage } from "./index.ts";
import { OutboundQueueNameEnum, type AnotherOutboundExampleEventPayloadType, type OutboundExampleEventPayloadType } from "./schemas/index.ts";
import type { QueueSenderContext, SenderRegistration } from "@cellix/service-queue-sender";
import type { QueueStorageSeedwork } from "@cellix/data-sources-queue-storage";

// Dummy payloads for testing
const outboundExamplePayload = {
  requiredField: "1234567",
  optionalField: "completed",
};
const anotherOutboundExamplePayload = {
  userId: "user-1",
  someField: "value",
};

describe("QueueStorage", () => {
  let registerSender: ReturnType<typeof vi.fn>;
  let createFactory: ReturnType<typeof vi.fn>;
  let context: QueueSenderContext;

  beforeEach(() => {
    registerSender = vi.fn();
    createFactory = vi.fn().mockReturnValue({
      sendMessageToOutboundExampleQueue: vi.fn(),
      sendMessageToAnotherOutboundExampleQueue: vi.fn(),
    });
    context = {
      service: {
        registerSender,
        createFactory,
      },
    };
  });

  it("registers all outbound queues with correct configurations", () => {
    // Act
    QueueStorage(context);

    // Assert
    expect(registerSender).toHaveBeenCalledTimes(2); // update this if more queues are added

    // Check Outbound Example queue sender registration
    const firstCall = registerSender.mock.calls[0];
    expect(firstCall).toBeDefined();
    const firstRegistration = firstCall?.[0] as SenderRegistration<OutboundExampleEventPayloadType>;
    expect(firstRegistration.queueName).toBe(OutboundQueueNameEnum.OUTBOUND_EXAMPLE);
    expect(typeof firstRegistration.extractLogTags).toBe("function");
    expect(typeof firstRegistration.extractLogMetadata).toBe("function");

    // Check Another Outbound Example queue sender registration
    const secondCall = registerSender.mock.calls[1];
    expect(secondCall).toBeDefined();
    const secondRegistration = secondCall?.[0] as SenderRegistration<AnotherOutboundExampleEventPayloadType>;
    expect(secondRegistration.queueName).toBe(OutboundQueueNameEnum.ANOTHER_OUTBOUND_EXAMPLE);
    expect(typeof secondRegistration.extractLogTags).toBe("function");
    expect(typeof secondRegistration.extractLogMetadata).toBe("function");
  });

  it("returns the API from createFactory with the correct methods", () => {
    // Act
    const factory = QueueStorage(context);

    // Assert
    expect(createFactory).toHaveBeenCalledTimes(1);
    expect(factory.sendMessageToOutboundExampleQueue).toBeDefined();
    expect(factory.sendMessageToAnotherOutboundExampleQueue).toBeDefined();
  });

  it("extractLogTags and extractLogMetadata work for outbound example", () => {
    // Arrange
    QueueStorage(context);
    const firstCall = registerSender.mock.calls[0];
    expect(firstCall).toBeDefined();
    const firstReg = firstCall?.[0] as SenderRegistration<OutboundExampleEventPayloadType>;
    // Act
    if (firstReg.extractLogTags) {
      const tags = firstReg.extractLogTags({
        eventPayload: outboundExamplePayload,
      } as unknown as QueueStorageSeedwork.MessageType<OutboundExampleEventPayloadType>);
      // Assert
      expect(tags).toEqual({
        queueName: OutboundQueueNameEnum.OUTBOUND_EXAMPLE,
        requiredField: "1234567",
      });
    }
    // Act
    if (firstReg.extractLogMetadata) {
      const meta = firstReg.extractLogMetadata({
        eventId: "id-1",
        eventTimestamp: "2023-01-01T00:00:00.000Z",
        eventPayload: outboundExamplePayload,
      } as unknown as QueueStorageSeedwork.MessageType<OutboundExampleEventPayloadType>);

      // Assert
      expect(meta).toEqual({
        eventId: "id-1",
        eventTimestamp: "2023-01-01T00:00:00.000Z",
      });
    }
  });

  it("extractLogTags and extractLogMetadata work for another outbound example", () => {
    // Arrange
    QueueStorage(context);
    const secondCall = registerSender.mock.calls[1];
    expect(secondCall).toBeDefined();
    const secondReg = secondCall?.[0] as SenderRegistration<AnotherOutboundExampleEventPayloadType>;
    // Act
    if (secondReg.extractLogTags) {
      const tags = secondReg.extractLogTags({
        eventPayload: anotherOutboundExamplePayload,
      } as unknown as QueueStorageSeedwork.MessageType<AnotherOutboundExampleEventPayloadType>);
      // Assert
      expect(tags).toEqual({
        queueName: OutboundQueueNameEnum.ANOTHER_OUTBOUND_EXAMPLE,
        userId: "user-1",
      });
    }
    if (secondReg.extractLogMetadata) {
      const meta = secondReg.extractLogMetadata({
        eventId: "id-2",
        eventTimestamp: "2023-01-02T00:00:00.000Z",
        eventPayload: anotherOutboundExamplePayload,
      } as unknown as QueueStorageSeedwork.MessageType<AnotherOutboundExampleEventPayloadType>);
      // Assert
      expect(meta).toEqual({
        eventId: "id-2",
        eventTimestamp: "2023-01-02T00:00:00.000Z",
      });
    }
  });
});
