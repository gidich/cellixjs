
import { type StaffRoleCommunityPermissionsSpec } from "../../community/roles/staff-role/staff-role-community-permissions.ts";
import type { StaffRoleEntityReference } from '../../community/roles/staff-role/staff-role.ts';
import type { CommunityVisa } from "../../community/community.visa.ts";
import type { StaffUserEntityReference } from "../../user/staff-user/staff-user.ts";

export class CommunityVisaImplForStaffRole<root extends StaffRoleEntityReference> implements CommunityVisa {
  constructor(private root: root, private user: StaffUserEntityReference) {}  
  
  determineIf(func:((permissions:StaffRoleCommunityPermissionsSpec) => boolean)) :  boolean {
    //ensure that the member is a member of the community
    if(!this.user || !this.root) {
      console.log("Staff Role Visa : undefined user or role", this.user, this.root);
      return false;
    }
    // const communityPermissions = this.user.role.permissions.communityPermissions;
    // if(!communityPermissions) {
    //   console.log("Staff Role Visa : no community permissions");
    //   return false;
    // }

    // change this after implementing user discriminator
    const communityPermissions: StaffRoleCommunityPermissionsSpec = {
      canManageStaffRolesAndPermissions: true,
      canChangeCommunityOwner: true,
      canDeleteCommunities: true,
      canManageAllCommunities: true,
      canReIndexSearchCollections: true
    }
    
    return func(communityPermissions as StaffRoleCommunityPermissionsSpec);
  }
}