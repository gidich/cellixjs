import type { ApiContextSpec } from '@ocom/api-context-spec';
import type { Domain } from '@ocom/api-domain';

export interface CommunityCreateCommand {
    name: string;
    createdBy: Domain.Contexts.User.EndUser.EndUserEntityReference;
}

export const create = (
    infrastructureServiceRegistry: ApiContextSpec,
    passport: Domain.Passport
) => {
    return async (command: CommunityCreateCommand): Promise<Domain.Contexts.Community.Community.CommunityEntityReference> => {
        // not sure if I like this, but strict typescript rules are complaining that it is never assigned; can change return type to CommunityEntityReference | undefined maybe?
         let communityToReturn: Domain.Contexts.Community.Community.CommunityEntityReference = {} as Domain.Contexts.Community.Community.CommunityEntityReference;
         await infrastructureServiceRegistry.domainDataSource.Community.Community.CommunityUnitOfWork.withTransaction(passport, async (repo) => {
            const newCommunity = await repo.getNewInstance(
                command.name,
                command.createdBy
            )
            // missing type converter here to convert to the domain

            // missing type converter here to convert back to persistence
            communityToReturn = await repo.save(newCommunity) as unknown as Domain.Contexts.Community.Community.CommunityEntityReference;
        });
        return communityToReturn;
    }
}