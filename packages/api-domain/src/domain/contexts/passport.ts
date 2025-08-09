import type { CommunityPassport } from './community/community.passport.ts';
import type { ServicePassport } from './service/service.passport.ts';
import type { UserPassport } from './user/user.passport.ts';
import type { Contexts } from '../index.ts';
import { MemberPassport, StaffUserPassport } from '../iam/index.ts';

export interface Passport {
	get community(): CommunityPassport;
	get service(): ServicePassport;
	get user(): UserPassport;
}

export const PassportFactory = {
    forMember(endUser: Contexts.User.EndUser.EndUserEntityReference, member: Contexts.Community.Member.MemberEntityReference, community: Contexts.Community.Community.CommunityEntityReference): Passport {
        return new MemberPassport(endUser, member, community);
    },

    forStaffUser(staffUser: Contexts.User.StaffUser.StaffUserEntityReference): Passport {
        return new StaffUserPassport(staffUser);
    },

    forReadOnly(): Passport {
        return {} as Passport; // need to implement read only passport implementation in IAM section
    }
}
