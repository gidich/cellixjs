import { getEndUserDataSource } from './end-user.data.ts';
import type { ModelsContext } from '../../../../index.ts';

export type { EndUserDataSource } from './end-user.data.ts';

export const EndUserDataSourceImpl = (models: ModelsContext) => {
    const EndUserModel = models.User?.EndUser;
    return {
        EndUserData: getEndUserDataSource(EndUserModel),
    };
};
