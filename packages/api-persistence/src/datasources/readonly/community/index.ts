import type { Domain } from '@ocom/api-domain';
import type { ModelsContext } from '../../../index.ts';
import { CommunityReadRepositoryImpl } from './community/index.ts';

export const CommunityContext = (models: ModelsContext, passport: Domain.Passport) => ({
    Community: CommunityReadRepositoryImpl(models, passport),
});
