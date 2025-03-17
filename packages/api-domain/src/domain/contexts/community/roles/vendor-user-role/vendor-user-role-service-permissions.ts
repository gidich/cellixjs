import { DomainSeedwork } from 'api-data-sources-seedwork';
import { CommunityVisa } from "../../community.visa";

export interface VendorUserRoleServicePermissionsSpec {
  canManageServices?: boolean;
  isSystemAccount?: boolean;
}

export interface VendorUserRoleServicePermissionsProps extends VendorUserRoleServicePermissionsSpec, DomainSeedwork.ValueObjectProps {}

export class VendorUserRoleServicePermissions extends DomainSeedwork.ValueObject<VendorUserRoleServicePermissionsProps> implements VendorUserRoleServicePermissionsEntityReference {
  constructor(props: VendorUserRoleServicePermissionsProps,private visa:CommunityVisa) {super(props);}

  get canManageServices(): boolean {return this.props.canManageServices;}
  get isSystemAccount(): boolean {return false;}

  // using setters from TS 5.1

  set CanManageServices(value:boolean) {
    if(! this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
    this.props.canManageServices = value;
  }
}

export interface VendorUserRoleServicePermissionsEntityReference extends Readonly<VendorUserRoleServicePermissionsProps> {}
