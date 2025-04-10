"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRoleCommunityPermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class StaffRoleCommunityPermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get canManageStaffRolesAndPermissions() {
        return this.props.canManageStaffRolesAndPermissions;
    }
    get canManageAllCommunities() {
        return this.props.canManageAllCommunities;
    }
    get canDeleteCommunities() {
        return this.props.canDeleteCommunities;
    }
    get canChangeCommunityOwner() {
        return this.props.canChangeCommunityOwner;
    }
    get canReIndexSearchCollections() {
        return this.props.canReIndexSearchCollections;
    }
    validateVisa() {
        if (!this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
    }
    // using setters from TS 5.1
    set CanManageStaffRolesAndPermissions(value) {
        this.validateVisa();
        this.props.canManageStaffRolesAndPermissions = value;
    }
    set CanManageAllCommunities(value) {
        this.validateVisa();
        this.props.canManageAllCommunities = value;
    }
    set CanDeleteCommunities(value) {
        this.validateVisa();
        this.props.canDeleteCommunities = value;
    }
    set CanChangeCommunityOwner(value) {
        this.validateVisa();
        this.props.canChangeCommunityOwner = value;
    }
    set CanReIndexSearchCollections(value) {
        this.validateVisa();
        this.props.canReIndexSearchCollections = value;
    }
}
exports.StaffRoleCommunityPermissions = StaffRoleCommunityPermissions;
//# sourceMappingURL=staff-role-community-permissions.js.map