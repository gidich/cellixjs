import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface EndUserRoleServiceTicketPermissionsSpec {
    canCreateTickets?: boolean;
    canManageTickets?: boolean;
    canAssignTickets?: boolean;
    canWorkOnTickets?: boolean;
    isEditingOwnTicket?: boolean;
    isEditingAssignedTicket?: boolean;
    isSystemAccount?: boolean;
}
export interface EndUserRoleServiceTicketPermissionsProps extends EndUserRoleServiceTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class EndUserRoleServiceTicketPermissions extends DomainSeedwork.ValueObject<EndUserRoleServiceTicketPermissionsProps> implements EndUserRoleServiceTicketPermissionsEntityReference {
    private visa;
    constructor(props: EndUserRoleServiceTicketPermissionsProps, visa: CommunityVisa);
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
export interface EndUserRoleServiceTicketPermissionsEntityReference extends Readonly<EndUserRoleServiceTicketPermissionsProps> {
}
