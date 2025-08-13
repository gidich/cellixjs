import type { DataSources } from '@ocom/api-persistence';
import { EndUser, type EndUserApplicationService } from './end-user/index.ts';

export interface UserApplicationService {
    EndUser: EndUserApplicationService;
}

export const User = (
    dataSources: DataSources
): UserApplicationService => {
    return {
        EndUser: EndUser(dataSources),
    }
}