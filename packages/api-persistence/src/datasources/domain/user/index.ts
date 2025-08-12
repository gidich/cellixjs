import type { ModelsContext } from '../../../index.ts';
import * as EndUser from './end-user/index.ts';

export const UserContextPersistence = (models: ModelsContext) => ({
	EndUser: EndUser.EndUserPersistence(models),
});
