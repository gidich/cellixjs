import { StaffRoleEntityReference } from './contexts/community/roles/staff-role/staff-role';
import { CommunityEntityReference } from './contexts/community/community/community';
import { CommunityVisa } from "./contexts/community/community.visa";
import { MemberEntityReference } from './contexts/community/member/member';
import { VendorUserEntityReference } from "./contexts/user/vendor-user/vendor-user";
import { VendorUserRoleEntityReference } from './contexts/community/roles/vendor-user-role/vendor-user-role';
import { ServiceEntityReference } from './contexts/community/service/service';
import { ServiceVisa } from './contexts/community/service/service.visa';
import { EndUserEntityReference } from './contexts/user/end-user/end-user';
import { EndUserVisa } from './contexts/user/end-user/end-user.visa';
import { StaffUserEntityReference } from './contexts/user/staff-user/staff-user';
import { StaffUserVisa } from './contexts/user/staff-user/staff-user.visa';
import { VendorUserVisa } from './contexts/user/vendor-user/vendor-user.visa';
import { EndUserRoleEntityReference } from './contexts/community/roles/end-user-role/end-user-role';
export declare const SystemUserId = "system";
export interface DomainVisa {
    forCommunity(root: CommunityEntityReference): CommunityVisa;
    forStaffRole(root: StaffRoleEntityReference): CommunityVisa;
    forVendorUserRole(root: VendorUserRoleEntityReference): CommunityVisa;
    forService(root: ServiceEntityReference): ServiceVisa;
    forVendorUserRole(root: VendorUserRoleEntityReference): CommunityVisa;
    forEndUser(root: EndUserEntityReference): EndUserVisa;
    forStaffUser(root: StaffUserEntityReference): StaffUserVisa;
    forVendorUser(root: VendorUserEntityReference): VendorUserVisa;
}
export declare class DomainVisaImpl implements DomainVisa {
    private readonly user;
    private readonly member;
    private readonly community;
    constructor(user: EndUserEntityReference | StaffUserEntityReference, member: MemberEntityReference, community?: CommunityEntityReference);
    forMember(root: MemberEntityReference): CommunityVisa;
    forCommunity(root: CommunityEntityReference): CommunityVisa;
    forCurrentCommunity(): CommunityVisa;
    forStaffRole(root: StaffRoleEntityReference): CommunityVisa;
    forEndUserRole(root: EndUserRoleEntityReference): CommunityVisa;
    forEndUser(root: EndUserEntityReference): EndUserVisa;
    forStaffUser(root: StaffUserEntityReference): StaffUserVisa;
    forService(root: ServiceEntityReference): ServiceVisa;
    forVendorUserRole(root: VendorUserRoleEntityReference): CommunityVisa;
    forVendorUser(root: VendorUserEntityReference): VendorUserVisa;
}
export declare class ReadOnlyDomainVisa implements DomainVisa {
    private constructor();
    static GetInstance(): DomainVisa;
    forMember(_root: MemberEntityReference): CommunityVisa;
    forCommunity(_root: CommunityEntityReference): CommunityVisa;
    forCurrentCommunity(): CommunityVisa;
    forStaffRole(_root: StaffRoleEntityReference): CommunityVisa;
    forEndUserRole(_root: EndUserRoleEntityReference): CommunityVisa;
    forEndUser(_root: EndUserEntityReference): EndUserVisa;
    forStaffUser(_root: StaffUserEntityReference): StaffUserVisa;
    forService(_root: ServiceEntityReference): ServiceVisa;
    forVendorUserRole(_root: VendorUserRoleEntityReference): CommunityVisa;
    forVendorUser(_root: VendorUserEntityReference): VendorUserVisa;
}
export declare class SystemDomainVisa implements DomainVisa {
    private constructor();
    static GetInstance(): DomainVisa;
    f: any;
    private communityPermissionsForSystem;
    private servicePermissionsForSystem;
    private staffUserPermissionsForSystem;
    forMember(root: MemberEntityReference): CommunityVisa;
    forCommunity(root: CommunityEntityReference): CommunityVisa;
    forCurrentCommunity(): CommunityVisa;
    forStaffRole(root: StaffRoleEntityReference): CommunityVisa;
    forEndUserRole(root: EndUserRoleEntityReference): CommunityVisa;
    forEndUser(root: EndUserEntityReference): EndUserVisa;
    forStaffUser(root: StaffUserEntityReference): StaffUserVisa;
    forService(root: ServiceEntityReference): ServiceVisa;
    forVendorUserRole(root: VendorUserRoleEntityReference): CommunityVisa;
    forVendorUser(root: VendorUserEntityReference): VendorUserVisa;
}
