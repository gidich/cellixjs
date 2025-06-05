import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import * as EndUser from './end-user/index.ts';


export const UserPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  return {
    EndUser: EndUser.EndUserPersistence(initializedService) 
  };
}

