"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserRoleViolationTicketPermissions = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class VendorUserRoleViolationTicketPermissions extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get canCreateTickets() {
        return this.props.canCreateTickets;
    }
    get canManageTickets() {
        return this.props.canManageTickets;
    }
    get canAssignTickets() {
        return this.props.canAssignTickets;
    }
    get canWorkOnTickets() {
        return this.props.canWorkOnTickets;
    }
    get isEditingOwnTicket() {
        return false;
    }
    get isEditingAssignedTicket() {
        return false;
    }
    get isSystemAccount() {
        return false;
    }
    // setters using ts 5.1
    set CanCreateTickets(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canCreateTickets = value;
    }
    set CanManageTickets(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canManageTickets = value;
    }
    set CanAssignTickets(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canAssignTickets = value;
    }
    set CanWorkOnTickets(value) {
        if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set permission');
        }
        this.props.canWorkOnTickets = value;
    }
}
exports.VendorUserRoleViolationTicketPermissions = VendorUserRoleViolationTicketPermissions;
//# sourceMappingURL=vendor-user-role-violation-ticket-permissions.js.map