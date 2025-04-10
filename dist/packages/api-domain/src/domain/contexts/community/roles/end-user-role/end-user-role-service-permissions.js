"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserRoleServicePermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class EndUserRoleServicePermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get canManageServices() { return this.props.canManageServices; }
    get isSystemAccount() { return false; }
    // using setters from TS 5.1
    set CanManageServices(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canManageServices = value;
    }
}
exports.EndUserRoleServicePermissions = EndUserRoleServicePermissions;
//# sourceMappingURL=end-user-role-service-permissions.js.map