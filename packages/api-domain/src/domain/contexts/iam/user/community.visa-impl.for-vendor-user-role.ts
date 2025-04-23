
import type { VendorUserRoleCommunityPermissionsSpec } from "./vendor-user-role-community-permissions.ts";
import type { MemberEntityReference } from '../../member/member.ts';
import type { VendorUserRoleEntityReference } from './vendor-user-role.ts';
import type { CommunityVisa } from "../../community.visa.ts";

export class CommunityVisaImplForVendorUserRole<root extends VendorUserRoleEntityReference> implements CommunityVisa {
  constructor(private root: root, private member: MemberEntityReference) {}  
  
  determineIf(func:((permissions:VendorUserRoleCommunityPermissionsSpec) => boolean)) :  boolean {
    //ensure that the member is a member of the community
    if(!this.member || this.member.community.id !== this.root.community.id) {
      console.log("Vendor User Role Visa : member is not a member of this community", this.member, this.root);
      return false;
    }
    const { communityPermissions } = this.member.role.permissions;
    if(!communityPermissions) {
      console.log("Vendor User Role Visa : no community permissions");
      return false;
    }
    
    return func(communityPermissions as VendorUserRoleCommunityPermissionsSpec);
  }
}