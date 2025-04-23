import { MongooseSeedwork }  from '../../cellix-data-sources-mongoose/dist/src';
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