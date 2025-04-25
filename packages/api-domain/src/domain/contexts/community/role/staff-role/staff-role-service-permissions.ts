import { DomainSeedwork } from '@cellix/domain-seedwork';
import { type CommunityVisa } from "../../community.visa.ts";

export interface StaffRoleServicePermissionsSpec {
  // canManageServices: boolean;
  // isSystemAccount: boolean;
}

export interface StaffRoleServicePermissionsProps extends StaffRoleServicePermissionsSpec, DomainSeedwork.ValueObjectProps {}

export class StaffRoleServicePermissions extends DomainSeedwork.ValueObject<StaffRoleServicePermissionsProps> implements StaffRoleServicePermissionsEntityReference {
  constructor(props: StaffRoleServicePermissionsProps,private visa:CommunityVisa) {super(props);}

  // get canManageServices(): boolean {return this.props.canManageServices;}
  // get isSystemAccount(): boolean {return false;}

  // using setters from TS 5.1

  // set canManageServices(value:boolean) {
  //   if(! this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
  //     throw new Error('Cannot set permission');
  //   }
  //   this.props.canManageServices = value;
  // }
}

export interface StaffRoleServicePermissionsEntityReference extends Readonly<StaffRoleServicePermissionsProps> {}
