import { MongooseSeedwork }  from '../../../cellix-data-sources-mongoose/dist/src';
import * as Community from './community';

export const CommunityPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  return {
    Community: Community.CommunityPersistence(initializedService)
  };

}