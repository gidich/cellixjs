import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import * as Community from './community/index.ts';

export const CommunityContextPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  return {
    Community: Community.CommunityPersistence(initializedService),
  };
};
