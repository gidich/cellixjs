import { DomainSeedwork } from '@cellix/domain-seedwork';
import { type CommunityVisa } from '../../community.visa.ts';
import { type CaseDomainPermissions } from '../../../case/case.domain-permissions.ts';

export interface EndUserRoleViolationTicketPermissionsProps
	extends CaseDomainPermissions,
		DomainSeedwork.ValueObjectProps {}
export interface EndUserRoleViolationTicketPermissionsEntityReference
	extends Readonly<EndUserRoleViolationTicketPermissionsProps> {}

export class EndUserRoleViolationTicketPermissions
	extends DomainSeedwork.ValueObject<EndUserRoleViolationTicketPermissionsProps>
	implements EndUserRoleViolationTicketPermissionsEntityReference
{
	private visa: CommunityVisa;

	constructor(
		props: EndUserRoleViolationTicketPermissionsProps,
		visa: CommunityVisa,
	) {
		super(props);
		this.visa = visa;
	}

	get canCreateTickets(): boolean {
		return this.props.canCreateTickets;
	}
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
	get canManageTickets(): boolean {
		return this.props.canManageTickets;
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
	get canAssignTickets(): boolean {
		return this.props.canAssignTickets;
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
	get canWorkOnTickets(): boolean {
		return this.props.canWorkOnTickets;
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
	get isEditingOwnTicket(): boolean {
		return false;
	}
	get isEditingAssignedTicket(): boolean {
		return false;
	}
	get isSystemAccount(): boolean {
		return false;
	}
}
