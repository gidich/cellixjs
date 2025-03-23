import { MongooseSeedwork }  from 'api-data-sources-mongoose-seedwork';
import * as Community from './community';
import * as User from './user';
import type { DomainDataSource } from 'api-domain';



export const Persistence = (initializedService: MongooseSeedwork.MongooseContextFactory): DomainDataSource => {
  if (!initializedService || !initializedService.service) {
    throw new Error('MongooseSeedwork.MongooseContextFactory is required');
  }
  const dataSource:DomainDataSource = {
    Community: Community.CommunityPersistence(initializedService),
    User: User.UserPersistence(initializedService),
  } ;
  return dataSource;
};