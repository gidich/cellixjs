import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import { getCommunityDataSource } from './community.data.ts';

export type { CommunityDataSource } from './community.data.ts';

export const CommunityDataSourceImpl = (
    initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
    const CommunityModel =
        Models.Community.CommunityModelFactory(initializedService);

    return {
        CommunityData: getCommunityDataSource(CommunityModel),
    };
};
