import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type * as Community from './community/index.ts';
import type * as EndUser from './user/end-user/index.ts';
import { CommunityContext } from './community/index.ts';
import { UserContext } from './user/index.ts';

export interface ReadonlyDataSource {
    Community: {
        Community: {
            CommunityData: Community.CommunityDataSource;
        };
    };
    User: {
        EndUser: {
            EndUserData: EndUser.EndUserDataSource;
        }
    }
}

export const ReadonlyDataSourceImplementation = (
    initializedService: MongooseSeedwork.MongooseContextFactory
): ReadonlyDataSource => {
    return {
        Community: CommunityContext(initializedService),
        User: UserContext(initializedService)
    };
}
