"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRoleServiceTicketPermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class StaffRoleServiceTicketPermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
}
exports.StaffRoleServiceTicketPermissions = StaffRoleServiceTicketPermissions;
//# sourceMappingURL=staff-role-service-ticket-permissions.js.map