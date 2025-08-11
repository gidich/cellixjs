import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import { getEndUserDataSource } from './end-user.data.ts';

export type { EndUserDataSource } from './end-user.data.ts';

export const EndUserDataSourceImpl = (
    initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	const UserModel = Models.User.UserModelFactory(initializedService);
	const EndUserModel = Models.User.EndUserModelFactory(UserModel);

    return {
        EndUserData: getEndUserDataSource(EndUserModel),
    };
};
