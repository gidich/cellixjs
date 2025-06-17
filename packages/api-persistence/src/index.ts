import { MongooseSeedwork }  from '@cellix/data-sources-mongoose';
import * as Community from './community/index.ts';
import * as User from './user/index.ts';
import type { DomainDataSource } from '@ocom/api-domain';



export const Persistence = (initializedService: MongooseSeedwork.MongooseContextFactory): DomainDataSource => {
  // [NN] [ESLINT] disabling the ESLint rule here to ensure that the initializedService is checked for null or undefined
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!initializedService?.service) {
    throw new Error('MongooseSeedwork.MongooseContextFactory is required');
  }

  const dataSource:DomainDataSource = {
    Community: Community.CommunityContextPersistence(initializedService),
    User: User.UserContextPersistence(initializedService),
  } ;
  return dataSource;
};