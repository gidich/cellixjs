export * as Domain from './domain';
import { Contexts } from './domain';
export interface DomainDataSource {
    Community: {
        Community: {
            CommunityUnitOfWork: Contexts.Community.Community.CommunityUnitOfWork;
        };
    };
    User: {
        EndUser: {
            EndUserUnitOfWork: Contexts.User.EndUser.EndUserUnitOfWork;
        };
    };
}
