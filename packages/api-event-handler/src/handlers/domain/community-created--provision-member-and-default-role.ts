import { Domain } from '@ocom/api-domain';

const { EventBusInstance, CommunityCreatedEvent } = Domain.Events;
export default (
    getContext: (payload?: unknown) => Domain.DomainExecutionContext
) => {
    EventBusInstance.register(CommunityCreatedEvent, async (payload) => {
        const { communityId } = payload;
        const context = getContext(payload);
        return await Domain.Services.Community.CommunityProvisioningService.provisionMemberAndDefaultRole(
            communityId,
            context
        );
    });
}