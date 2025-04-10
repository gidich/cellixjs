"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserRolePermissions = void 0;
const vendor_user_role_community_permissions_1 = require("./vendor-user-role-community-permissions");
const vendor_user_role_property_permissions_1 = require("./vendor-user-role-property-permissions");
const vendor_user_role_service_ticket_permissions_1 = require("./vendor-user-role-service-ticket-permissions");
const vendor_user_role_service_permissions_1 = require("./vendor-user-role-service-permissions");
const vendor_user_role_violation_ticket_permissions_1 = require("./vendor-user-role-violation-ticket-permissions");
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class VendorUserRolePermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get communityPermissions() {
        return new vendor_user_role_community_permissions_1.VendorUserRoleCommunityPermissions(this.props.communityPermissions, this.visa);
    }
    get propertyPermissions() {
        return new vendor_user_role_property_permissions_1.VendorUserRolePropertyPermissions(this.props.propertyPermissions, this.visa);
    }
    get serviceTicketPermissions() {
        return new vendor_user_role_service_ticket_permissions_1.VendorUserRoleServiceTicketPermissions(this.props.serviceTicketPermissions, this.visa);
    }
    get servicePermissions() {
        return new vendor_user_role_service_permissions_1.VendorUserRoleServicePermissions(this.props.servicePermissions, this.visa);
    }
    get violationTicketPermissions() {
        return new vendor_user_role_violation_ticket_permissions_1.VendorUserRoleViolationTicketPermissions(this.props.violationTicketPermissions, this.visa);
    }
}
exports.VendorUserRolePermissions = VendorUserRolePermissions;
//# sourceMappingURL=vendor-user-role-permissions.js.map