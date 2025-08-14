import type { Domain } from '@ocom/api-domain';
import type { DataSources } from '@ocom/api-persistence';
import { type CommunityCreateCommand, create,  } from './create.ts';

export interface CommunityApplicationService {
    create: (command: CommunityCreateCommand) => Promise<Domain.Contexts.Community.Community.CommunityEntityReference>
}

export const Community = (
    dataSources: DataSources
): CommunityApplicationService => {
    return {
        create: create(dataSources)
    }
}