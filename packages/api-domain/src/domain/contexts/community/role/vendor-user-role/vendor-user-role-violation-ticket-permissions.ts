import { DomainSeedwork } from '@cellix/domain-seedwork';
import { type CommunityVisa } from "../../community.visa.ts";

export interface VendorUserRoleViolationTicketPermissionsSpec {
  canCreateTickets?: boolean;
  canManageTickets?: boolean;
  canAssignTickets?: boolean;
  canWorkOnTickets?: boolean;
  isEditingOwnTicket?: boolean;
  isEditingAssignedTicket?: boolean;
  isSystemAccount?: boolean;
}

export interface VendorUserRoleViolationTicketPermissionsProps extends VendorUserRoleViolationTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {}

export class VendorUserRoleViolationTicketPermissions extends DomainSeedwork.ValueObject<VendorUserRoleViolationTicketPermissionsProps> implements VendorUserRoleViolationTicketPermissionsEntityReference {
  constructor(props: VendorUserRoleViolationTicketPermissionsProps, private visa: CommunityVisa) {
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

export interface VendorUserRoleViolationTicketPermissionsEntityReference extends Readonly<VendorUserRoleViolationTicketPermissionsProps> {}



