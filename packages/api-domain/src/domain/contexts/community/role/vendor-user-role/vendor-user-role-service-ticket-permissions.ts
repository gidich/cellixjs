import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { CommunityVisa } from '../../community.visa.ts';
import type { CaseDomainPermissions } from '../../../case/case.domain-permissions.ts';

export interface VendorUserRoleServiceTicketPermissionsProps
	extends CaseDomainPermissions,
		DomainSeedwork.ValueObjectProps {}
export interface VendorUserRoleServiceTicketPermissionsEntityReference
	extends Readonly<VendorUserRoleServiceTicketPermissionsProps> {}

export class VendorUserRoleServiceTicketPermissions
	extends DomainSeedwork.ValueObject<VendorUserRoleServiceTicketPermissionsProps>
	implements VendorUserRoleServiceTicketPermissionsEntityReference
{
	private readonly visa: CommunityVisa;
	constructor(
		props: VendorUserRoleServiceTicketPermissionsProps,
		visa: CommunityVisa,
	) {
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

	set CanCreateTickets(value: boolean) {
		if (
			!this.visa.determineIf(
				(permissions) =>
					permissions.canManageEndUserRolesAndPermissions ||
					permissions.isSystemAccount,
			)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set permission');
		}
		this.props.canCreateTickets = value;
	}

	set CanManageTickets(value: boolean) {
		if (
			!this.visa.determineIf(
				(permissions) =>
					permissions.canManageEndUserRolesAndPermissions ||
					permissions.isSystemAccount,
			)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set permission');
		}
		this.props.canManageTickets = value;
	}

	set CanAssignTickets(value: boolean) {
		if (
			!this.visa.determineIf(
				(permissions) =>
					permissions.canManageEndUserRolesAndPermissions ||
					permissions.isSystemAccount,
			)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set permission');
		}
		this.props.canAssignTickets = value;
	}

	set CanWorkOnTickets(value: boolean) {
		if (
			!this.visa.determineIf(
				(permissions) =>
					permissions.canManageEndUserRolesAndPermissions ||
					permissions.isSystemAccount,
			)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set permission');
		}
		this.props.canWorkOnTickets = value;
	}
}
