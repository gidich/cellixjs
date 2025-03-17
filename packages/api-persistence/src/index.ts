import { MongooseSeedwork }  from 'api-data-sources-mongoose-seedwork';
import * as Community from './community';
import * as User from './user';
import type { DomainDataSource } from 'api-domain';



export const Persistence = (initializedService: MongooseSeedwork.MongooseContextFactory): DomainDataSource => {
  const dataSource:DomainDataSource = {
    Community: Community.CommunityPersistence(initializedService),
    User: User.UserPersistence(initializedService),
  } ;
  return dataSource;
};