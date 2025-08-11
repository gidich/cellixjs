import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import { getCommunityUnitOfWork } from './community.uow.ts';

export const CommunityPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	const CommunityModel =
		Models.Community.CommunityModelFactory(initializedService);

	return {
		CommunityUnitOfWork: getCommunityUnitOfWork(CommunityModel),
	};
};
