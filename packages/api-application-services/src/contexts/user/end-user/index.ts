import type { Domain } from '@ocom/api-domain';
import type { DataSources } from '@ocom/api-persistence';
import { type EndUserQueryByIdCommand, queryById  } from './query-by-id.ts';
import { type EndUserQueryByNameCommand, queryByName } from './query-by-name.ts';

export interface EndUserApplicationService {
    queryById: (command: EndUserQueryByIdCommand) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference | null>
    queryByName: (command: EndUserQueryByNameCommand) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]>;
}

export const EndUser = (
    dataSources: DataSources,
): EndUserApplicationService => {
    return {
        queryById: queryById(dataSources),
        queryByName: queryByName(dataSources)
    }
}