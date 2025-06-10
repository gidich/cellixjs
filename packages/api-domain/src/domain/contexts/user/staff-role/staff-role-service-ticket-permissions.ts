import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';

export interface StaffRoleServiceTicketPermissionsSpec {
  // canCreateTickets: boolean;
  // canManageTickets: boolean;
  // canAssignTickets: boolean;
  // canWorkOnTickets: boolean;
  // isEditingOwnTicket: boolean;
  // isEditingAssignedTicket: boolean;
  // isSystemAccount: boolean;
}

export interface StaffRoleServiceTicketPermissionsProps extends StaffRoleServiceTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {}
export interface StaffRoleServiceTicketPermissionsEntityReference extends Readonly<StaffRoleServiceTicketPermissionsProps> {}

export class StaffRoleServiceTicketPermissions extends DomainSeedwork.ValueObject<StaffRoleServiceTicketPermissionsProps> implements StaffRoleServiceTicketPermissionsEntityReference {
  constructor(props: StaffRoleServiceTicketPermissionsProps, _visa: UserVisa) {
    super(props);
  }

  // get canCreateTickets(): boolean {
  //   return this.props.canCreateTickets;
  // }
  // get canManageTickets(): boolean {
  //   return this.props.canManageTickets;
  // }
  // get canAssignTickets(): boolean {
  //   return this.props.canAssignTickets;
  // }
  // get canWorkOnTickets(): boolean {
  //   return this.props.canWorkOnTickets;
  // }
  // get isEditingOwnTicket(): boolean {
  //   return false;
  // }
  // get isEditingAssignedTicket(): boolean {
  //   return false;
  // }
  // get isSystemAccount(): boolean {
  //   return false;
  // }

  // setters using ts 5.1

  // set canCreateTickets(value: boolean) {
  //   if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
  //     throw new Error('Cannot set permission');
  //   }
  //   this.props.canCreateTickets = value;
  // }

  // set canManageTickets(value: boolean) {
  //   if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
  //     throw new Error('Cannot set permission');
  //   }
  //   this.props.canManageTickets = value;
  // }

  // set canAssignTickets(value: boolean) {
  //   if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
  //     throw new Error('Cannot set permission');
  //   }
  //   this.props.canAssignTickets = value;
  // }

  // set canWorkOnTickets(value: boolean) {
  //   if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
  //     throw new Error('Cannot set permission');
  //   }
  //   this.props.canWorkOnTickets = value;
  // }
}


