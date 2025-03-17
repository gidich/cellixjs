
import { VendorUserRoleCommunityPermissionsSpec } from "./vendor-user-role-community-permissions";
import { MemberEntityReference } from '../../member/member';
import { VendorUserRoleEntityReference } from './vendor-user-role';
import { CommunityVisa } from "../../community.visa";

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