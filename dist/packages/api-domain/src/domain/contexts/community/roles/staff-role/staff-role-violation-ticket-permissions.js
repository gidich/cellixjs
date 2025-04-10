"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRoleViolationTicketPermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class StaffRoleViolationTicketPermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
}
exports.StaffRoleViolationTicketPermissions = StaffRoleViolationTicketPermissions;
//# sourceMappingURL=staff-role-violation-ticket-permissions.js.map