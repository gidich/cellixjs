"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRolePropertyPermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class StaffRolePropertyPermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
}
exports.StaffRolePropertyPermissions = StaffRolePropertyPermissions;
//# sourceMappingURL=staff-role-property-permissions.js.map