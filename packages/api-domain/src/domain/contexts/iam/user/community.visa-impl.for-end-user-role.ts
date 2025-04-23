
import type { MemberEntityReference } from '../../community/member/member.ts';
import type { EndUserRoleEntityReference } from '../../community/roles/end-user-role/end-user-role.ts';
import type { CommunityVisa } from '../../community/community.visa.ts';
import type { CommunityPermissions } from '../../community/community.permissions.ts';

export class CommunityVisaImplForEndUserRole<root extends EndUserRoleEntityReference> implements CommunityVisa {
  private readonly root: root;
  private readonly member: MemberEntityReference;
  constructor(root: root, member: MemberEntityReference) {
    this.root = root;
    this.member = member;
  }  
  
  determineIf(func:((permissions:CommunityPermissions) => boolean)) :  boolean {
    //ensure that the member is a member of the community
    if(!this.member || this.member.community.id !== this.root.community.id) {
      console.log("End User Role Visa : member is not a member of this community", this.member, this.root);
      return false;
    }
    const {communityPermissions} = this.member.role.permissions;
    if(!communityPermissions) {
      console.log("End User Role Visa : no community permissions");
      return false;
    }
    
    return func(communityPermissions as CommunityPermissions);
  }
}