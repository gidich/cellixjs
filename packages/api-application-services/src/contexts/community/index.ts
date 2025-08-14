import type { DataSources } from '@ocom/api-persistence';
import { Community as CommunityApi, type CommunityApplicationService } from './community/index.ts';

export interface CommunityContextApplicationService {
    Community: CommunityApplicationService;
}

export const Community = (
    dataSources: DataSources
): CommunityContextApplicationService => {
    return {
        Community: CommunityApi(dataSources),
    }
}