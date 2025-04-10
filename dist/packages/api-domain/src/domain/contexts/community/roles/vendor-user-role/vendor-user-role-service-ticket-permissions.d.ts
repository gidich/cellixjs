import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface VendorUserRoleServiceTicketPermissionsSpec {
    canCreateTickets?: boolean;
    canManageTickets?: boolean;
    canAssignTickets?: boolean;
    canWorkOnTickets?: boolean;
    isEditingOwnTicket?: boolean;
    isEditingAssignedTicket?: boolean;
    isSystemAccount?: boolean;
}
export interface VendorUserRoleServiceTicketPermissionsProps extends VendorUserRoleServiceTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class VendorUserRoleServiceTicketPermissions extends DomainSeedwork.ValueObject<VendorUserRoleServiceTicketPermissionsProps> implements VendorUserRoleServiceTicketPermissionsEntityReference {
    private visa;
    constructor(props: VendorUserRoleServiceTicketPermissionsProps, visa: CommunityVisa);
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
export interface VendorUserRoleServiceTicketPermissionsEntityReference extends Readonly<VendorUserRoleServiceTicketPermissionsProps> {
}
