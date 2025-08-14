import type { Domain } from '@ocom/api-domain';
import type { ModelsContext } from '../../../index.ts';
import * as Community from './community/index.ts';


export const CommunityContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	Community: Community.CommunityPersistence(models, passport),
});
