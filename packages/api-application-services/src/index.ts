import type { ApiContextSpec } from '@ocom/api-context-spec';
import { Domain } from '@ocom/api-domain';
import { Community, type CommunityApplicationService } from './contexts/community/index.ts';
import { User, type UserApplicationService } from './contexts/user/index.ts';

export interface ApplicationServices {
    Community: CommunityApplicationService;
    User: UserApplicationService;
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
        const tokenValidationResult = { verifiedJwt: { sub: '123e4567-e89b-12d3-a456-426614174000'}, openIdConfigKey: 'AccountPortal'};
        let passport = Domain.PassportFactory.forReadOnly();
        if (tokenValidationResult !== null) {
            const { openIdConfigKey } = tokenValidationResult;
            if (openIdConfigKey === 'AccountPortal') {
                // when datastore infra service is available, can query for actual documents here

                // const endUser = await infrastructureServicesRegistry.dataSources.readonlyDataSource.User.EndUser.EndUserData.findOne({ externalId: verifiedJwt.sub });
                // if (!endUser) {
                //     throw new Error('end user not found');
                // }
                await Promise.resolve();

                if (hints?.memberId) {
                    // Query for member document
                }

                if (hints?.communityId) {
                    // Query for community document
                }

                const endUser = { id: '123' } as unknown as Domain.Contexts.User.EndUser.EndUserEntityReference;
                const member = { id: '456', community: { id: '789'}, accounts: [{ user: { id: '123'} }]} as unknown as Domain.Contexts.Community.Member.MemberEntityReference;
                const community = { id: '789'} as Domain.Contexts.Community.Community.CommunityEntityReference;
                passport = Domain.PassportFactory.forMember(endUser, member, community);
            } else if (openIdConfigKey === 'StaffPortal') {
                const staffUser = {} as Domain.Contexts.User.StaffUser.StaffUserEntityReference;
                passport = Domain.PassportFactory.forStaffUser(staffUser);
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