import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { CommunityVisa } from '../../community.visa.ts';

export interface VendorUserRoleServicePermissionsSpec {
	canManageServices: boolean;
	isSystemAccount: boolean;
}

export interface VendorUserRoleServicePermissionsProps
	extends VendorUserRoleServicePermissionsSpec,
		DomainSeedwork.ValueObjectProps {}
export interface VendorUserRoleServicePermissionsEntityReference
	extends Readonly<VendorUserRoleServicePermissionsProps> {}

export class VendorUserRoleServicePermissions
	extends DomainSeedwork.ValueObject<VendorUserRoleServicePermissionsProps>
	implements VendorUserRoleServicePermissionsEntityReference
{
	private readonly visa: CommunityVisa;
	constructor(
		props: VendorUserRoleServicePermissionsProps,
		visa: CommunityVisa
	) {
		super(props);
		this.visa = visa;
	}

	get canManageServices(): boolean {
		return this.props.canManageServices;
	}
	get isSystemAccount(): boolean {
		return false;
	}

	// using setters from TS 5.1

	set CanManageServices(value: boolean) {
		if (
			!this.visa.determineIf(
				(permissions) =>
					permissions.canManageEndUserRolesAndPermissions ||
					permissions.isSystemAccount
			)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set permission');
		}
		this.props.canManageServices = value;
	}
}
