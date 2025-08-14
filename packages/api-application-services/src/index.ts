import type { ApiContextSpec } from '@ocom/api-context-spec';
import { Domain } from '@ocom/api-domain';
import { Community, type CommunityContextApplicationService } from './contexts/community/index.ts';
import { User, type UserContextApplicationService } from './contexts/user/index.ts';

export interface ApplicationServices {
    Community: CommunityContextApplicationService;
    User: UserContextApplicationService;
}

export interface VerifiedJwt {
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  sub: string;
  oid?: string;
  unique_name?: string;
  roles?: string[];
}

export type PrincipalHints = {
    memberId: string | undefined;
    communityId: string | undefined;
};

export interface AppServicesHost<S> {
    forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
    // forSystem: (opts?: unknown) => Promise<S>;
    // forAzureFunction: (opts?: unknown) => Promise<S>;
}

export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;

export const buildApplicationServicesFactory = (infrastructureServicesRegistry: ApiContextSpec): ApplicationServicesFactory => {

    const forRequest = async (_rawAuthHeader?: string, _hints?: PrincipalHints): Promise<ApplicationServices> => {
        // const tokenValidationResult= rawAuthHeader ? await infrastructureServicesRegistry.tokenValidationService.verifyJwt<VerifiedJwt>(rawAuthHeader) : null;
        const tokenValidationResult = { verifiedJwt: { sub: '123e4567-e89b-12d3-a456-426614174000' }, openIdConfigKey: 'AccountPortal' }; // fake JWT details to bypass token validation service until fully implemented
        let passport = Domain.PassportFactory.forGuest();
        if (tokenValidationResult !== null) {
            const { openIdConfigKey } = tokenValidationResult;
            // const { readonlyDataSource } = infrastructureServicesRegistry.dataSourcesFactory.withSystemPassport();
            if (openIdConfigKey === 'AccountPortal') {
                await Promise.resolve(); 
                // const endUser = await readonlyDataSource.User.EndUser.EndUserReadRepo.getByExternalId(verifiedJwt.sub);
                const endUser = { id: '123' } as unknown as Domain.Contexts.User.EndUser.EndUserEntityReference;
                // const member = hints?.memberId ? await readonlyDataSource.Community.Member.MemberReadRepo.getById(hints?.memberId) : null;
                const member = { id: '456', community: { id: '789' }, accounts: [{ user: { id: '123' }}]} as unknown as Domain.Contexts.Community.Member.MemberEntityReference;
                // const community = hints?.communityId ? await readonlyDataSource.Community.Community.CommunityReadRepo.getById(hints?.communityId) : null;
                const community = { id: '789' } as unknown as Domain.Contexts.Community.Community.CommunityEntityReference;

                if (endUser && member && community) {
                    passport = Domain.PassportFactory.forMember(endUser, member, community);
                }
            } else if (openIdConfigKey === 'StaffPortal') {
                const staffUser = undefined;
                // const staffUser = await readonlyDataSource.User.StaffUser.StaffUserReadRepo.getByExternalId(verifiedJwt.sub);
                if (staffUser) {
                    passport = Domain.PassportFactory.forStaffUser(staffUser);
                }
            }
        }

        const dataSources = infrastructureServicesRegistry.dataSourcesFactory.withPassport(passport);

        return {
            Community: Community(dataSources),
            User: User(dataSources)
        }
    }

    return {
        forRequest
    }
}