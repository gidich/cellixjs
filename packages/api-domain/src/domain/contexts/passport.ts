import type { CommunityPassport } from './community/community.passport.ts';
import type { ServicePassport } from './service/service.passport.ts';
import type { UserPassport } from './user/user.passport.ts';
import type { Contexts } from '../index.ts';
import { GuestPassport, MemberPassport, ReadOnlyPassport, StaffUserPassport } from '../iam/index.ts';

export interface Passport {
	get community(): CommunityPassport;
	get service(): ServicePassport;
	get user(): UserPassport;
}

export const PassportFactory = {
    // for logged-in users on account portal not within a community
    // forEndUser(endUser: Contexts.User.EndUser.EndUserEntityReference): Passport {
    //     return new EndUserPassport(endUser);
    // },

    // for logged-in users on account portal within a community
    forMember(endUser: Contexts.User.EndUser.EndUserEntityReference, member: Contexts.Community.Member.MemberEntityReference, community: Contexts.Community.Community.CommunityEntityReference): Passport {
        return new MemberPassport(endUser, member, community);
    },

    // for logged-in users on staff portal - defers to role permissions for that staff user
    forStaffUser(staffUser: Contexts.User.StaffUser.StaffUserEntityReference): Passport {
        return new StaffUserPassport(staffUser);
    },

    // for logged-in users on vendor portal - defers to role permissions for that vendor user
    // forVendorUser(vendorUser: Contexts.User.VendorUser.VendorUserEntityReference): Passport {
    //     return new VendorUserPassport(vendorUser);
    // },

    // for users who are not logged in on any portal - defaults to false for all permissions
    forGuest(): Passport {
        return new GuestPassport();
    },

    // for internal system use with limited access to only the readonly datasource to fetch entity references for collections
    forReadOnly(): Passport { 
        return new ReadOnlyPassport();
    },

    // for internal system use with full access to datasources on behalf of a user (permissions somehow derived from the user?)
    // forSystem(): Passport {
    //     return {} as Passport; // need to implement system passport implementation in IAM section
    // }
}
