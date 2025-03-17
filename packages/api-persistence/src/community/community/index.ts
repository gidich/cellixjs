import { MongooseSeedwork }  from 'api-data-sources-mongoose-seedwork';
import { Models } from 'api-data-sources-mongoose-models';
import { getCommunityUnitOfWork } from './community.uow';

export const CommunityPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  const CommunityModel = Models.Community.CommunityModelFactory(initializedService)

  return {
    CommunityUnitOfWork: getCommunityUnitOfWork(CommunityModel),
  };

}
