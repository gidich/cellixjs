import type { ModelsContext } from '../../../../index.ts';
import { getEndUserReadRepository } from './end-user.read-repository.ts';

export type { EndUserReadRepository } from './end-user.read-repository.ts';

export const EndUserReadRepositoryImpl = (models: ModelsContext) => {
    return {
        EndUserReadRepo: getEndUserReadRepository(models),
    };
};
