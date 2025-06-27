export * as Domain from './domain/index.ts';
import { Contexts } from './domain/index.ts';

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
