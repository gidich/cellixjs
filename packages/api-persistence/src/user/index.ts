import { MongooseSeedwork }  from '../../../cellix-data-sources-mongoose/dist/src';
import * as EndUser from './end-user';


export const UserPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  return {
    EndUser: EndUser.EndUserPersistence(initializedService) 
  };
}

