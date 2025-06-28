import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import { getEndUserUnitOfWork } from './end-user.uow.ts';

export const EndUserPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	const UserModel = Models.User.UserModelFactory(initializedService);
	const EndUserModel = Models.User.EndUserModelFactory(UserModel);

	return {
		EndUserUnitOfWork: getEndUserUnitOfWork(EndUserModel),
	};
};
