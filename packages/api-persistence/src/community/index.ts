import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import * as Community from './community/index.ts';

export const CommunityPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  return {
    Community: Community.CommunityPersistence(initializedService)
  };

}