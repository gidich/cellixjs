import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { EndUserDataSourceImpl } from './end-user/index.ts';

export type { EndUserDataSource } from './end-user/index.ts';

export const UserContext = (
    initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
    return {
        EndUser: EndUserDataSourceImpl(initializedService),
    };
};
