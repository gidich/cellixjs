import type { DomainDataSource } from '@ocom/api-domain';
import type { ModelsContext } from '../../index.ts';
import { CommunityContextPersistence } from './community/index.ts';
import { UserContextPersistence } from './user/index.ts';

export const DomainDataSourceImplementation = (models: ModelsContext): DomainDataSource => ({
    Community: CommunityContextPersistence(models),
    User: UserContextPersistence(models)
});