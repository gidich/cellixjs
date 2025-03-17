import { MongooseSeedwork }  from 'api-data-sources-mongoose-seedwork';
import * as Community from './community';

export const CommunityPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  return {
    Community: Community.CommunityPersistence(initializedService)
  };

}