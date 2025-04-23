import { MongooseSeedwork }  from '../../../../cellix-data-sources-mongoose/dist/src';
import { Models } from 'api-data-sources-mongoose-models';
import { getEndUserUnitOfWork } from './end-user.uow';
import { DomainSeedwork } from 'cellix-domain-seedwork';


export const EndUserPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  const UserModel = Models.User.UserModelFactory(initializedService);
  const EndUserModel = Models.User.EndUserModelFactory(UserModel);

  return {
    EndUserUnitOfWork: getEndUserUnitOfWork(EndUserModel) ,
  };

}
