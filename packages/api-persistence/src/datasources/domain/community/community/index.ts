import { getCommunityUnitOfWork } from './community.uow.ts';
import type { ModelsContext } from '../../../../index.ts';

export const CommunityPersistence = (models: ModelsContext) => {
	const CommunityModel = models.Community.Community;
	return {
		CommunityUnitOfWork: getCommunityUnitOfWork(CommunityModel),
	};
};
