import { MongooseSeedwork }  from '@cellix/data-sources-mongoose';
import * as Community from './community/index.ts';
import * as User from './user/index.ts';
import type { DomainDataSource } from '@ocom/api-domain';



export const Persistence = (initializedService: MongooseSeedwork.MongooseContextFactory): DomainDataSource => {
  if (!initializedService || !initializedService.service) {
    throw new Error('MongooseSeedwork.MongooseContextFactory is required');
  }
  const dataSource:DomainDataSource = {
    Community: Community.CommunityContextPersistence(initializedService),
    User: User.UserContextPersistence(initializedService),
  } ;
  return dataSource;
};