"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserRolePermissions = void 0;
const end_user_role_community_permissions_1 = require("./end-user-role-community-permissions");
const end_user_role_property_permissions_1 = require("./end-user-role-property-permissions");
const end_user_role_service_ticket_permissions_1 = require("./end-user-role-service-ticket-permissions");
const end_user_role_service_permissions_1 = require("./end-user-role-service-permissions");
const end_user_role_violation_ticket_permissions_1 = require("./end-user-role-violation-ticket-permissions");
//import { ValueObject, ValueObjectProps } from '../../../../../../../seedwork/domain-seedwork/value-object';
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class EndUserRolePermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get communityPermissions() {
        return new end_user_role_community_permissions_1.EndUserRoleCommunityPermissions(this.props.communityPermissions, this.visa);
    }
    get propertyPermissions() {
        return new end_user_role_property_permissions_1.EndUserRolePropertyPermissions(this.props.propertyPermissions, this.visa);
    }
    get serviceTicketPermissions() {
        return new end_user_role_service_ticket_permissions_1.EndUserRoleServiceTicketPermissions(this.props.serviceTicketPermissions, this.visa);
    }
    get servicePermissions() {
        return new end_user_role_service_permissions_1.EndUserRoleServicePermissions(this.props.servicePermissions, this.visa);
    }
    get violationTicketPermissions() {
        return new end_user_role_violation_ticket_permissions_1.EndUserRoleViolationTicketPermissions(this.props.violationTicketPermissions, this.visa);
    }
}
exports.EndUserRolePermissions = EndUserRolePermissions;
//# sourceMappingURL=end-user-role-permissions.js.map