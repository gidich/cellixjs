"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRoleServicePermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class StaffRoleServicePermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
}
exports.StaffRoleServicePermissions = StaffRoleServicePermissions;
//# sourceMappingURL=staff-role-service-permissions.js.map