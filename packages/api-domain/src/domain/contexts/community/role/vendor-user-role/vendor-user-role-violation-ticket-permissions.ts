import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { CommunityVisa } from '../../community.visa.ts';
import type { CaseDomainPermissions } from '../../../case/case.domain-permissions.ts';

export interface VendorUserRoleViolationTicketPermissionsProps extends CaseDomainPermissions, DomainSeedwork.ValueObjectProps {}
export interface VendorUserRoleViolationTicketPermissionsEntityReference extends Readonly<VendorUserRoleViolationTicketPermissionsProps> {}

export class VendorUserRoleViolationTicketPermissions
  extends DomainSeedwork.ValueObject<VendorUserRoleViolationTicketPermissionsProps>
  implements VendorUserRoleViolationTicketPermissionsEntityReference
{
  private readonly visa: CommunityVisa;
  constructor(props: VendorUserRoleViolationTicketPermissionsProps, visa: CommunityVisa) {
    super(props);
    this.visa = visa;
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

  set canCreateTickets(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canCreateTickets = value;
  }

  set canManageTickets(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canManageTickets = value;
  }

  set canAssignTickets(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canAssignTickets = value;
  }

  set canWorkOnTickets(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canWorkOnTickets = value;
  }
}
