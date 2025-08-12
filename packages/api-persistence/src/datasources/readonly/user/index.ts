import { EndUserDataSourceImpl } from './end-user/index.ts';
import type { ModelsContext } from '../../../index.ts';



export const UserContext = (models: ModelsContext) => ({
    EndUser: EndUserDataSourceImpl(models),
});
