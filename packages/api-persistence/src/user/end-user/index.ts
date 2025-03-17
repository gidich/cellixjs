import { MongooseSeedwork }  from 'api-data-sources-mongoose-seedwork';
import { Models } from 'api-data-sources-mongoose-models';
import { getEndUserUnitOfWork } from './end-user.uow';
import { DomainSeedwork } from 'api-data-sources-seedwork';


export const EndUserPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  const UserModel = Models.User.UserModelFactory(initializedService);
  const EndUserModel = Models.User.EndUserModelFactory(UserModel);

  return {
    EndUserUnitOfWork: getEndUserUnitOfWork(EndUserModel) ,
  };

}
