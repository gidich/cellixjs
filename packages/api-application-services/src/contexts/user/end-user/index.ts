import type { ApiContextSpec } from '@ocom/api-context-spec';
import type { Domain } from '@ocom/api-domain';
import { type EndUserQueryByIdCommand, queryById  } from './query-by-id.ts';
import { type EndUserQueryByNameCommand, queryByName } from './query-by-name.ts';

export interface EndUserApplicationService {
    queryById: (command: EndUserQueryByIdCommand) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference | null>
    queryByName: (command: EndUserQueryByNameCommand) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]>;
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