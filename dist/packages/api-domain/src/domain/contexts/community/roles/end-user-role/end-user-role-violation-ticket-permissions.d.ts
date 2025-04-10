import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface EndUserRoleViolationTicketPermissionsSpec {
    canCreateTickets?: boolean;
    canManageTickets?: boolean;
    canAssignTickets?: boolean;
    canWorkOnTickets?: boolean;
    isEditingOwnTicket?: boolean;
    isEditingAssignedTicket?: boolean;
    isSystemAccount?: boolean;
}
export interface EndUserRoleViolationTicketPermissionsProps extends EndUserRoleViolationTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class EndUserRoleViolationTicketPermissions extends DomainSeedwork.ValueObject<EndUserRoleViolationTicketPermissionsProps> implements EndUserRoleViolationTicketPermissionsEntityReference {
    private visa;
    constructor(props: EndUserRoleViolationTicketPermissionsProps, visa: CommunityVisa);
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
export interface EndUserRoleViolationTicketPermissionsEntityReference extends Readonly<EndUserRoleViolationTicketPermissionsProps> {
}
