import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Domain } from '@ocom/api-domain';
import * as Community from './community/index.ts';

export const CommunityContextPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
    domainServices: Domain.Services,
) => {
	return {
		Community: Community.CommunityPersistence(initializedService, domainServices),
	};
};
