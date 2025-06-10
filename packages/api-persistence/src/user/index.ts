import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import * as EndUser from './end-user/index.ts';


export const UserContextPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  return {
    EndUser: EndUser.EndUserPersistence(initializedService) 
  };
}

