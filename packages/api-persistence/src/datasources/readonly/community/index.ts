import { CommunityDataSourceImpl } from './community/index.ts';
import type { ModelsContext } from '../../../index.ts';

export type { CommunityDataSource } from './community/index.ts';


export const CommunityContext = (models: ModelsContext) => ({
    Community: CommunityDataSourceImpl(models),
});
