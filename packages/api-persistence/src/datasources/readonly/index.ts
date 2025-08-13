import type { Domain } from '@ocom/api-domain';
import type { ModelsContext } from '../../index.ts';
import type * as Community from './community/index.ts';
import { CommunityContext } from './community/index.ts';
import type * as EndUser from './user/end-user/index.ts';
import { UserContext } from './user/index.ts';

export interface ReadonlyDataSource {
    Community: {
        Community: {
            CommunityData: Community.CommunityDataSource;
        };
    };
    User: {
        EndUser: {
            EndUserReadRepo: EndUser.EndUserReadRepository;
        }
    }
}

export const ReadonlyDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): ReadonlyDataSource => ({
    Community: CommunityContext(models),
    User: UserContext(models, passport)
});
