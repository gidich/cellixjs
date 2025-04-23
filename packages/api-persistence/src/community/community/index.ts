import { MongooseSeedwork }  from '../../../../cellix-data-sources-mongoose/dist/src';
import { Models } from 'api-data-sources-mongoose-models';
import { getCommunityUnitOfWork } from './community.uow';

export const CommunityPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  const CommunityModel = Models.Community.CommunityModelFactory(initializedService)

  return {
    CommunityUnitOfWork: getCommunityUnitOfWork(CommunityModel),
  };

}
