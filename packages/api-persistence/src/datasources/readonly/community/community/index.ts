import { getCommunityDataSource } from './community.data.ts';
import type { ModelsContext } from '../../../../index.ts';

export type { CommunityDataSource } from './community.data.ts';

export const CommunityDataSourceImpl = (models: ModelsContext) => {
    const CommunityModel = models.Community.Community;
    return {
        CommunityData: getCommunityDataSource(CommunityModel),
    };
};
