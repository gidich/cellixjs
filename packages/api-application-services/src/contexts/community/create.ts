import type { ApiContextSpec } from '@ocom/api-context-spec';
import { Domain } from '@ocom/api-domain';

export interface CommunityCreateCommand {
    name: string;
    createdByEndUserId: string;
}

export const create = (
    infrastructureServiceRegistry: ApiContextSpec,
    passport: Domain.Passport
) => {
    return async (command: CommunityCreateCommand): Promise<Domain.Contexts.Community.Community.CommunityEntityReference> => {
         return await infrastructureServiceRegistry.domainDataSource.Community.Community.CommunityUnitOfWork.withTransaction(passport, async (repo) => {
            // const createdBy = await infrastructureServiceRegistry.datastore.User.EndUser.findById(command.createdByEndUserId);
            const createdBy = new Domain.Contexts.User.EndUser.EndUser(
                {
                    id: command.createdByEndUserId,
                } as Domain.Contexts.User.EndUser.EndUserEntityReference,
                passport
            );
            const newCommunity = await repo.getNewInstance(
                command.name,
                createdBy
            )
            return await repo.save(newCommunity) as unknown as Domain.Contexts.Community.Community.CommunityEntityReference;
        });
    }
}