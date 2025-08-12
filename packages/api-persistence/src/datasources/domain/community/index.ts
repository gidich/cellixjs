import * as Community from './community/index.ts';
import type { ModelsContext } from '../../../index.ts';

export const CommunityContextPersistence = (models: ModelsContext) => ({
	Community: Community.CommunityPersistence(models),
});
