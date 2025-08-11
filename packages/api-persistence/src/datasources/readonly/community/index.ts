import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { CommunityDataSourceImpl } from './community/index.ts';

export type { CommunityDataSource } from './community/index.ts';

export const CommunityContext = (
    initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
    return {
        Community: CommunityDataSourceImpl(initializedService),
    };
};
