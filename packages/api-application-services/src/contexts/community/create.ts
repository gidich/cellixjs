import type { ApiContextSpec } from '@ocom/api-context-spec';
import type { Domain } from '@ocom/api-domain';

export interface CommunityCreateCommand {
	name: string;
	createdByEndUserId: string;
}

export const create = (
	infrastructureServiceRegistry: ApiContextSpec,
	passport: Domain.Passport,
) => {
	return async (
		command: CommunityCreateCommand,
	): Promise<Domain.Contexts.Community.Community.CommunityEntityReference> => {
        const createdBy = await infrastructureServiceRegistry.dataSources.readonlyDataSource.User.EndUser.EndUserReadRepo.getById(passport, command.createdByEndUserId);
        if (!createdBy) {
            throw new Error(`End user not found for id ${command.createdByEndUserId}`);
        }
        let communityToReturn: Domain.Contexts.Community.Community.CommunityEntityReference = {} as Domain.Contexts.Community.Community.CommunityEntityReference;
		await infrastructureServiceRegistry.dataSources.domainDataSource.Community.Community.CommunityUnitOfWork.withTransaction(
			passport,
			async (repo) => {
                const newCommunity = await repo.getNewInstance(command.name, createdBy);
                communityToReturn = await repo.save(newCommunity);
			},
		);
		return communityToReturn;
	};
};
