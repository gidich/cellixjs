import type { MemberEntityReference } from '../../community/member/member.ts';
import type { ServiceEntityReference } from '../../service/service.ts';
import type { ServiceVisa } from '../../service/service.visa.ts';
import type { ServicePermissions } from '../../service/service.permissions.ts';

export class ServiceVisaImpl<root extends ServiceEntityReference> implements ServiceVisa {
  private readonly root: root;
  private readonly member: MemberEntityReference;
  constructor(root: root, member: MemberEntityReference) {
    this.root = root;
    this.member = member;
  }

  determineIf(func: ((permissions: ServicePermissions) => boolean)): boolean {
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
