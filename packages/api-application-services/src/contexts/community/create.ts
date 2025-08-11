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
        const createdBy = await infrastructureServiceRegistry.dataSources.readonlyDataSource.User.EndUser.EndUserData.findById(command.createdByEndUserId);
        if (!createdBy) {
            throw new Error(`End user not found for id ${command.createdByEndUserId}`);
        }
		return await infrastructureServiceRegistry.dataSources.domainDataSource.Community.Community.CommunityUnitOfWork.withTransaction(
			passport,
			async (repo) => {
                const newCommunity = await repo.getNewInstance(command.name, createdBy as unknown as Domain.Contexts.User.EndUser.EndUserEntityReference); 
                return await repo.save(newCommunity);
			},
		);
	};
};
