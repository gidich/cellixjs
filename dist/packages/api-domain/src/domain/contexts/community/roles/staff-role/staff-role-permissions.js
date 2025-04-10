"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRolePermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const staff_role_community_permissions_1 = require("./staff-role-community-permissions");
const staff_role_property_permissions_1 = require("./staff-role-property-permissions");
const staff_role_service_ticket_permissions_1 = require("./staff-role-service-ticket-permissions");
const staff_role_service_permissions_1 = require("./staff-role-service-permissions");
const staff_role_violation_ticket_permissions_1 = require("./staff-role-violation-ticket-permissions");
class StaffRolePermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get communityPermissions() {
        return new staff_role_community_permissions_1.StaffRoleCommunityPermissions(this.props.communityPermissions, this.visa);
    }
    get propertyPermissions() {
        return new staff_role_property_permissions_1.StaffRolePropertyPermissions(this.props.propertyPermissions, this.visa);
    }
    get serviceTicketPermissions() {
        return new staff_role_service_ticket_permissions_1.StaffRoleServiceTicketPermissions(this.props.serviceTicketPermissions, this.visa);
    }
    get servicePermissions() {
        return new staff_role_service_permissions_1.StaffRoleServicePermissions(this.props.servicePermissions, this.visa);
    }
    get violationTicketPermissions() {
        return new staff_role_violation_ticket_permissions_1.StaffRoleViolationTicketPermissions(this.props.violationTicketPermissions, this.visa);
    }
}
exports.StaffRolePermissions = StaffRolePermissions;
//# sourceMappingURL=staff-role-permissions.js.map