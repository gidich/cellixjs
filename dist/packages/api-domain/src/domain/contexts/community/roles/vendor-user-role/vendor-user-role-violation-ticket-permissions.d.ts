import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface VendorUserRoleViolationTicketPermissionsSpec {
    canCreateTickets?: boolean;
    canManageTickets?: boolean;
    canAssignTickets?: boolean;
    canWorkOnTickets?: boolean;
    isEditingOwnTicket?: boolean;
    isEditingAssignedTicket?: boolean;
    isSystemAccount?: boolean;
}
export interface VendorUserRoleViolationTicketPermissionsProps extends VendorUserRoleViolationTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class VendorUserRoleViolationTicketPermissions extends DomainSeedwork.ValueObject<VendorUserRoleViolationTicketPermissionsProps> implements VendorUserRoleViolationTicketPermissionsEntityReference {
    private visa;
    constructor(props: VendorUserRoleViolationTicketPermissionsProps, visa: CommunityVisa);
    get canCreateTickets(): boolean;
    get canManageTickets(): boolean;
    get canAssignTickets(): boolean;
    get canWorkOnTickets(): boolean;
    get isEditingOwnTicket(): boolean;
    get isEditingAssignedTicket(): boolean;
    get isSystemAccount(): boolean;
    set CanCreateTickets(value: boolean);
    set CanManageTickets(value: boolean);
    set CanAssignTickets(value: boolean);
    set CanWorkOnTickets(value: boolean);
}
export interface VendorUserRoleViolationTicketPermissionsEntityReference extends Readonly<VendorUserRoleViolationTicketPermissionsProps> {
}
