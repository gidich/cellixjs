import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import { getCommunityUnitOfWork } from './community.uow.ts';
import type { Domain } from '@ocom/api-domain';

export const CommunityPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
    domainServices: Domain.Services
) => {
	const CommunityModel =
		Models.Community.CommunityModelFactory(initializedService);

	return {
		CommunityUnitOfWork: getCommunityUnitOfWork(CommunityModel, domainServices),
	};
};
