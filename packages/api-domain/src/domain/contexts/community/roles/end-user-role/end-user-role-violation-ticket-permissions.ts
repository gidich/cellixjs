import { DomainSeedwork } from 'api-data-sources-seedwork';
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

export interface EndUserRoleViolationTicketPermissionsProps extends EndUserRoleViolationTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {}

export class EndUserRoleViolationTicketPermissions extends DomainSeedwork.ValueObject<EndUserRoleViolationTicketPermissionsProps> implements EndUserRoleViolationTicketPermissionsEntityReference {
  constructor(props: EndUserRoleViolationTicketPermissionsProps, private visa: CommunityVisa) {
    super(props);
  }

  get canCreateTickets(): boolean {
    return this.props.canCreateTickets;
  }
  get canManageTickets(): boolean {
    return this.props.canManageTickets;
  }
  get canAssignTickets(): boolean {
    return this.props.canAssignTickets;
  }
  get canWorkOnTickets(): boolean {
    return this.props.canWorkOnTickets;
  }
  get isEditingOwnTicket(): boolean {
    return false;
  }
  get isEditingAssignedTicket(): boolean {
    return false;
  }
  get isSystemAccount(): boolean {
    return false;
  }

  // setters using ts 5.1

  set CanCreateTickets(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canCreateTickets = value;
  }

  set CanManageTickets(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canManageTickets = value;
  }

  set CanAssignTickets(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canAssignTickets = value;
  }

  set CanWorkOnTickets(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canWorkOnTickets = value;
  }
}

export interface EndUserRoleViolationTicketPermissionsEntityReference extends Readonly<EndUserRoleViolationTicketPermissionsProps> {}



