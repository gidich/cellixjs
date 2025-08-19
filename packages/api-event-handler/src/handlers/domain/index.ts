import type { Domain } from '@ocom/api-domain';
import RegisterCommunityCreatedProvisionMemberAndDefaultRoleHandler from './community-created--provision-member-and-default-role.ts';

export type DomainExecutionContextFactory = (payload?: unknown) => Domain.DomainExecutionContext;

let _contextFactory: DomainExecutionContextFactory | null = null;

export function setDomainExecutionContextFactory(factory: DomainExecutionContextFactory): void {
    _contextFactory = factory;
}

export function getDomainExecutionContext(payload?: unknown): Domain.DomainExecutionContext {
    if (!_contextFactory) {
        throw new Error('DomainExecutionContextFactory not configured');
    }
    return _contextFactory(payload);
}

export const RegisterDomainEventHandlers = (): void => {
    RegisterCommunityCreatedProvisionMemberAndDefaultRoleHandler(getDomainExecutionContext);
};

