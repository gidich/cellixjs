"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserRolePropertyPermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class EndUserRolePropertyPermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get canManageProperties() {
        return this.props.canManageProperties;
    }
    get canEditOwnProperty() {
        return this.props.canEditOwnProperty;
    }
    get isEditingOwnProperty() {
        return false;
    }
    get isSystemAccount() {
        return false;
    }
    // setters using TS 5.1
    set CanManageProperties(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canManageProperties = value;
    }
    set CanEditOwnProperty(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canEditOwnProperty = value;
    }
}
exports.EndUserRolePropertyPermissions = EndUserRolePropertyPermissions;
//# sourceMappingURL=end-user-role-property-permissions.js.map