import type { Domain } from '@ocom/api-domain';
import type { DataSources } from '@ocom/api-persistence';
import { type CommunityCreateCommand, create,  } from './create.ts';
import { queryById, type CommunityQueryByIdCommand } from './query-by-id.ts';

export interface CommunityApplicationService {
    create: (command: CommunityCreateCommand) => Promise<Domain.Contexts.Community.Community.CommunityEntityReference>,
    queryById: (command: CommunityQueryByIdCommand) => Promise<Domain.Contexts.Community.Community.CommunityEntityReference | null>,
}

export const Community = (
    dataSources: DataSources
): CommunityApplicationService => {
    return {
        create: create(dataSources),
        queryById: queryById(dataSources),
    }
}