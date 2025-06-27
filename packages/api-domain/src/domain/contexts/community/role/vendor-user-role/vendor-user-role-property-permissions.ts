import { DomainSeedwork } from '@cellix/domain-seedwork';
import { type CommunityVisa } from '../../community.visa.ts';
import { type PropertyPermissions } from '../../../property/property.permissions.ts';

export interface VendorUserRolePropertyPermissionsProps
	extends PropertyPermissions,
		DomainSeedwork.ValueObjectProps {}
export interface VendorUserRolePropertyPermissionsEntityReference
	extends Readonly<VendorUserRolePropertyPermissionsProps> {}

export class VendorUserRolePropertyPermissions
	extends DomainSeedwork.ValueObject<VendorUserRolePropertyPermissionsProps>
	implements VendorUserRolePropertyPermissionsEntityReference
{
	private readonly visa: CommunityVisa;
	constructor(
		props: VendorUserRolePropertyPermissionsProps,
		visa: CommunityVisa,
	) {
		super(props);
		this.visa = visa;
	}

	get canManageProperties(): boolean {
		return this.props.canManageProperties;
	}
	get canEditOwnProperty(): boolean {
		return this.props.canEditOwnProperty;
	}
	get isEditingOwnProperty(): boolean {
		return false;
	}
	get isSystemAccount(): boolean {
		return false;
	}

	// setters using TS 5.1

	set CanManageProperties(value: boolean) {
		if (
			!this.visa.determineIf(
				(permissions) =>
					permissions.canManageEndUserRolesAndPermissions ||
					permissions.isSystemAccount,
			)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set permission');
		}
		this.props.canManageProperties = value;
	}

	set CanEditOwnProperty(value: boolean) {
		if (
			!this.visa.determineIf(
				(permissions) =>
					permissions.canManageEndUserRolesAndPermissions ||
					permissions.isSystemAccount,
			)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set permission');
		}
		this.props.canEditOwnProperty = value;
	}
}
