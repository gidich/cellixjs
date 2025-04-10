"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemDomainVisa = exports.ReadOnlyDomainVisa = exports.DomainVisaImpl = exports.SystemUserId = void 0;
const community_visa_impl_for_community_1 = require("./contexts/community/community/community.visa-impl.for-community");
const service_visa_1 = require("./contexts/community/service/service.visa");
const end_user_visa_1 = require("./contexts/user/end-user/end-user.visa");
const staff_user_visa_1 = require("./contexts/user/staff-user/staff-user.visa");
const vendor_user_visa_1 = require("./contexts/user/vendor-user/vendor-user.visa");
const community_visa_impl_for_member_1 = require("./contexts/community/member/community.visa-impl.for-member");
const community_visa_impl_for_staff_role_1 = require("./contexts/community/roles/staff-role/community.visa-impl.for-staff-role");
const community_visa_impl_for_end_user_role_1 = require("./contexts/community/roles/end-user-role/community.visa-impl.for-end-user-role");
const community_visa_impl_for_vendor_user_role_1 = require("./contexts/community/roles/vendor-user-role/community.visa-impl.for-vendor-user-role");
exports.SystemUserId = 'system';
class DomainVisaImpl {
    constructor(user, member, community = null) {
        this.user = user;
        this.member = member;
        this.community = community;
        if (!user) {
            throw new Error("User is required");
        }
        if (member !== null && !member.accounts.find(account => account.user.id === user.id)) {
            throw new Error(`User ${user.id} is not a member of the community ${member.community.id}`);
        }
    }
    forMember(root) {
        return new community_visa_impl_for_member_1.CommunityVisaImplForMember(root, this.member);
    }
    forCommunity(root) {
        return new community_visa_impl_for_community_1.CommunityVisaImplForCommunity(root, this.member, this.user);
    }
    forCurrentCommunity() {
        return this.forCommunity(this.community);
    }
    forStaffRole(root) {
        return new community_visa_impl_for_staff_role_1.CommunityVisaImplForStaffRole(root, this.user);
    }
    forEndUserRole(root) {
        return new community_visa_impl_for_end_user_role_1.CommunityVisaImplForEndUserRole(root, this.member);
    }
    forEndUser(root) {
        return new end_user_visa_1.EndUserVisaImpl(root, this.user);
    }
    forStaffUser(root) {
        return new staff_user_visa_1.StaffUserVisaImpl(root, this.user);
    }
    forService(root) {
        return new service_visa_1.ServiceVisaImpl(root, this.member);
    }
    forVendorUserRole(root) {
        return new community_visa_impl_for_vendor_user_role_1.CommunityVisaImplForVendorUserRole(root, this.member);
    }
    forVendorUser(root) {
        return new vendor_user_visa_1.VendorUserVisaImpl(root, this.user);
    }
}
exports.DomainVisaImpl = DomainVisaImpl;
class ReadOnlyDomainVisa {
    constructor() {
        //prevent public construction
    }
    static GetInstance() {
        return new ReadOnlyDomainVisa();
    }
    forMember(_root) {
        return { determineIf: () => false };
    }
    forCommunity(_root) {
        return { determineIf: () => false };
    }
    forCurrentCommunity() {
        return { determineIf: () => false };
    }
    forStaffRole(_root) {
        return { determineIf: () => false };
    }
    forEndUserRole(_root) {
        return { determineIf: () => false };
    }
    forEndUser(_root) {
        return { determineIf: () => false };
    }
    forStaffUser(_root) {
        return { determineIf: () => false };
    }
    forService(_root) {
        return { determineIf: () => false };
    }
    forVendorUserRole(_root) {
        return { determineIf: () => false };
    }
    forVendorUser(_root) {
        return { determineIf: () => false };
    }
}
exports.ReadOnlyDomainVisa = ReadOnlyDomainVisa;
class SystemDomainVisa {
    constructor() {
        this.communityPermissionsForSystem = {
            canManageRolesAndPermissions: false,
            canManageCommunitySettings: false,
            canManageSiteContent: false,
            canManageMembers: false,
            canEditOwnMemberProfile: false,
            canEditOwnMemberAccounts: false,
            isEditingOwnMemberAccount: false,
            isSystemAccount: true,
        };
        this.servicePermissionsForSystem = {
            canManageServices: false,
            isSystemAccount: true,
        };
        this.staffUserPermissionsForSystem = {
            isEditingOwnAccount: false,
            isSystemAccount: true,
        };
        //prevent public construction
    }
    static GetInstance() {
        return new SystemDomainVisa();
    }
    forMember(root) {
        return { determineIf: (func) => func(this.communityPermissionsForSystem) };
    }
    forCommunity(root) {
        return { determineIf: (func) => func(this.communityPermissionsForSystem) };
    }
    forCurrentCommunity() {
        return { determineIf: (func) => func(this.communityPermissionsForSystem) };
    }
    forStaffRole(root) {
        return { determineIf: (func) => func(this.communityPermissionsForSystem) };
    }
    forEndUserRole(root) {
        return { determineIf: (func) => func(this.communityPermissionsForSystem) };
    }
    forEndUser(root) {
        return { determineIf: () => false };
    }
    forStaffUser(root) {
        return { determineIf: (func) => func(this.staffUserPermissionsForSystem) };
    }
    forService(root) {
        return { determineIf: (func) => func(this.servicePermissionsForSystem) };
    }
    forVendorUserRole(root) {
        return { determineIf: (func) => func(this.communityPermissionsForSystem) };
    }
    forVendorUser(root) {
        return { determineIf: () => false };
    }
}
exports.SystemDomainVisa = SystemDomainVisa;
//# sourceMappingURL=domain.visa.js.map