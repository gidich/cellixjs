import type { ApiContextSpec } from '@ocom/api-context-spec';
import type { Domain } from '@ocom/api-domain';
import { type CommunityCreateCommand, create,  } from './create.ts';

export interface CommunityApplicationService {
    create: (command: CommunityCreateCommand) => Promise<Domain.Contexts.Community.Community.CommunityEntityReference>
}

export const Community = (
    infrastructureServiceRegistry: ApiContextSpec,
    passport: Domain.Passport
): CommunityApplicationService => {
    return {
        create: create(infrastructureServiceRegistry, passport)
    }
}