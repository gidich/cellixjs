"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserRoleCommunityPermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class VendorUserRoleCommunityPermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get canManageRolesAndPermissions() {
        return this.props.canManageRolesAndPermissions;
    }
    get canManageCommunitySettings() {
        return this.props.canManageCommunitySettings;
    }
    get canManageSiteContent() {
        return this.props.canManageSiteContent;
    }
    get canManageMembers() {
        return this.props.canManageMembers;
    }
    get canEditOwnMemberProfile() {
        return this.props.canEditOwnMemberProfile;
    }
    get canEditOwnMemberAccounts() {
        return this.props.canEditOwnMemberAccounts;
    }
    get isEditingOwnMemberAccount() {
        return false;
    }
    get isSystemAccount() {
        return false;
    }
    // using setters from TS 5.1
    set CanManageRolesAndPermissions(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission1');
        }
        this.props.canManageRolesAndPermissions = value;
    }
    set CanManageCommunitySettings(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission2');
        }
        this.props.canManageCommunitySettings = value;
    }
    set CanManageSiteContent(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission3');
        }
        this.props.canManageSiteContent = value;
    }
    set CanManageMembers(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canManageMembers = value;
    }
    set CanEditOwnMemberProfile(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canEditOwnMemberProfile = value;
    }
    set CanEditOwnMemberAccounts(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canEditOwnMemberAccounts = value;
    }
}
exports.VendorUserRoleCommunityPermissions = VendorUserRoleCommunityPermissions;
//# sourceMappingURL=vendor-user-role-community-permissions.js.map