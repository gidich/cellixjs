import type { ModelsContext } from '../../../index.ts';
import { EndUserReadRepositoryImpl } from './end-user/index.ts';

export const UserContext = (models: ModelsContext) => ({
    EndUser: EndUserReadRepositoryImpl(models),
});
