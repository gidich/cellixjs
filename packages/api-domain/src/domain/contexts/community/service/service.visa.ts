import { PassportSeedwork } from '@cellix/domain-seedwork';
import type { MemberEntityReference } from '../member/member.ts';
import type { StaffRoleServicePermissionsSpec } from '../roles/staff-role/staff-role-service-permissions.ts';
import type { EndUserRoleServicePermissionsSpec } from '../roles/end-user-role/end-user-role-service-permissions.ts';
import type { ServiceEntityReference } from './service.ts';

export interface ServicePermissionsSpec extends StaffRoleServicePermissionsSpec, EndUserRoleServicePermissionsSpec {}

export interface ServiceVisa extends PassportSeedwork.Visa {
  determineIf(func:((permissions:ServicePermissionsSpec) => boolean)) :  boolean ;
}

export class ServiceVisaImpl<root extends ServiceEntityReference> implements ServiceVisa {
  constructor(private root: root, private member: MemberEntityReference) {
  }

  determineIf(func: ((permissions: ServicePermissionsSpec) => boolean)): boolean {
    //ensure that the member is a member of this community
    if (!this.member || this.member.community.id !== this.root.community.id) {
      console.log("Service Visa : member is not a member of this community", this.member, this.root);
      return false;
    }
    const {servicePermissions} = this.member.role.permissions;
    if (!servicePermissions) {
      console.log("Service Visa : no community permissions");
      return false;
    }

    return func(servicePermissions);
  }
}

