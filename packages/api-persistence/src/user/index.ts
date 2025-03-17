import { MongooseSeedwork }  from 'api-data-sources-mongoose-seedwork';
import * as EndUser from './end-user';


export const UserPersistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
  return {
    EndUser: EndUser.EndUserPersistence(initializedService) 
  };
}

