import type { Domain } from '@ocom/api-domain';
import type { DataSources } from '@ocom/api-persistence';

export interface CommunityCreateCommand {
	name: string;
	createdByEndUserId: string;
}

export const create = (
    dataSources: DataSources
) => {
	return async (
		command: CommunityCreateCommand,
	): Promise<Domain.Contexts.Community.Community.CommunityEntityReference> => {
        const createdBy = await dataSources.readonlyDataSource.User.EndUser.EndUserReadRepo.getById(command.createdByEndUserId);
        if (!createdBy) {
            throw new Error(`End user not found for id ${command.createdByEndUserId}`);
        }
        let communityToReturn: Domain.Contexts.Community.Community.CommunityEntityReference | undefined;
		await dataSources.domainDataSource.Community.Community.CommunityUnitOfWork.withScopedTransaction(
			async (repo) => {
                const newCommunity = await repo.getNewInstance(command.name, createdBy);
                communityToReturn = await repo.save(newCommunity);
			},
		);
        if (!communityToReturn) { throw new Error('community not found'); }
        return communityToReturn;
	};
};
