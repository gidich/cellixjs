import type { ApiContextSpec } from '@ocom/api-context-spec';
import type { Models } from '@ocom/api-data-sources-mongoose-models';
import type { Domain } from '@ocom/api-domain';
import { type EndUserQueryByIdCommand, queryById  } from './query-by-id.ts';
import { type EndUserQueryByNameCommand, queryByName } from './query-by-name.ts';

export interface EndUserApplicationService {
    queryById: (command: EndUserQueryByIdCommand) => Promise<Models.User.EndUser | null>
    queryByName: (command: EndUserQueryByNameCommand) => Promise<Models.User.EndUser[]>;
}

export const EndUser = (
    infrastructureServiceRegistry: ApiContextSpec,
    passport: Domain.Passport
): EndUserApplicationService => {
    return {
        queryById: queryById(infrastructureServiceRegistry, passport),
        queryByName: queryByName(infrastructureServiceRegistry, passport)
    }
}