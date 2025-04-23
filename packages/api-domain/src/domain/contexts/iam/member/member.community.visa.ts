
import type { CommunityPermissions } from '../../community/community.permissions.ts';
import type { CommunityVisa } from '../../community/community.visa.ts';
import { type MemberEntityReference } from '../../community/member/member.ts';
import { type CommunityEntityReference } from '../../community/community/community.ts';


export class MemberCommunityVisa<root extends CommunityEntityReference> implements CommunityVisa {
  private readonly root: root;
  private readonly member: MemberEntityReference;

  constructor(root: root, member: MemberEntityReference) {
    this.root = root;
    this.member = member;
  }  
  
  determineIf(func:((permissions:CommunityPermissions) => boolean)) :  boolean {
    //ensure that the member is a member of this community
    if(!this.member || this.member.community.id !== this.root.id) {
      console.log("Member Visa: member is not a member of this community", this.member, this.root);
      return false;
    }

    const {communityPermissions} = this.member.role.permissions;
    if(!communityPermissions) {
      console.log("Member Visa: no community permissions");
      return false;
    }

    const updatedPermissions = Object.create(communityPermissions, {
       isEditingOwnMemberAccount : {value: (this.member.id === this.root.id)} // override isEditingOwnMemberAccount
    }) as CommunityPermissions;
      
    return func(updatedPermissions);
  }
}