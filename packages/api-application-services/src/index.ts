import type { ApiContextSpec } from '@ocom/api-context-spec';
import { Domain } from '@ocom/api-domain';
import { Community, type CommunityApplicationService } from './contexts/community/index.ts';

export interface ApplicationServices {
    Community: CommunityApplicationService;
}

export type PrincipalHints = {
    memberId: string | undefined;
    communityId: string | undefined;
};

export interface AppServicesHost<S> {
    forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
    // forSystem can be added later without breaking Cellix API:
    // forSystem?: (opts?: unknown) => Promise<S>;
}

export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;

export const buildApplicationServicesFactory = (infrastructureServicesRegistry: ApiContextSpec): ApplicationServicesFactory => {

    const forRequest = async (rawAuthHeader?: string, hints?: PrincipalHints): Promise<ApplicationServices> => {
        console.log('rawAuthHeader: ', rawAuthHeader);
        console.log('hints: ', hints);
        // const tokenValidationResult = await infrastructureServicesRegistry.tokenValidationService.verifyJwt(rawAuthHeader as string);
        const tokenValidationResult = { verifiedJwt: { sub: '123'}, openIdConfigKey: 'AccountPortal'};

        let passport = Domain.PassportFactory.forReadOnly();
        if (tokenValidationResult !== null) {
            const { verifiedJwt, openIdConfigKey } = tokenValidationResult;
            if (openIdConfigKey === 'AccountPortal') {
                // when datastore infra service is available, can query for actual documents here

                if (verifiedJwt?.sub) {
                    // Query for end user document by externalId
                    await Promise.resolve();
                }

                if (hints?.memberId) {
                    // Query for member document
                }

                if (hints?.communityId) {
                    // Query for community document
                }

                const endUser = { id: '123' } as Domain.Contexts.User.EndUser.EndUserEntityReference;
                const member = { id: '456', community: { id: '789'}, accounts: [{ user: { id: '123'} }]} as unknown as Domain.Contexts.Community.Member.MemberEntityReference;
                const community = { id: '789'} as Domain.Contexts.Community.Community.CommunityEntityReference;
                passport = Domain.PassportFactory.forMember(endUser, member, community);
            } else if (openIdConfigKey === 'StaffPortal') {
                const staffUser = {} as Domain.Contexts.User.StaffUser.StaffUserEntityReference;
                passport = Domain.PassportFactory.forStaffUser(staffUser);
            }
        }

        return {
            Community: Community(infrastructureServicesRegistry, passport),
        }
    }

    return {
        forRequest
    }
}