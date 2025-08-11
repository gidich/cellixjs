import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@ocom/api-domain';
import { CommunityContextPersistence } from './community/index.ts';
import { UserContextPersistence } from './user/index.ts';

export const DomainDataSourceImplementation = (
    initializedService: MongooseSeedwork.MongooseContextFactory
): DomainDataSource => {
    return {
        Community: CommunityContextPersistence(initializedService),
        User: UserContextPersistence(initializedService)
    }
};