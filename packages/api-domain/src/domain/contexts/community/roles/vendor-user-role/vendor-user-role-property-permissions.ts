import { DomainSeedwork } from 'api-data-sources-seedwork';
import { CommunityVisa } from "../../community.visa";

export interface VendorUserRolePropertyPermissionsSpec {
  canManageProperties?: boolean;
  canEditOwnProperty?: boolean;
  isEditingOwnProperty?: boolean;
  isSystemAccount?: boolean;
}

export interface VendorUserRolePropertyPermissionsProps extends VendorUserRolePropertyPermissionsSpec, DomainSeedwork.ValueObjectProps {}

export class VendorUserRolePropertyPermissions extends DomainSeedwork.ValueObject<VendorUserRolePropertyPermissionsProps> implements VendorUserRolePropertyPermissionsEntityReference {
  constructor(props: VendorUserRolePropertyPermissionsProps, private visa: CommunityVisa) {
    super(props);
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
    if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canManageProperties = value;
  }

  set CanEditOwnProperty(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canEditOwnProperty = value;
  }
}

export interface VendorUserRolePropertyPermissionsEntityReference extends Readonly<VendorUserRolePropertyPermissionsProps> {}
