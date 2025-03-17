
import { MemberEntityReference } from './member';
import { CommunityVisa, CommunityPermissionsSpec } from '../community.visa';

export class CommunityVisaImplForMember<root extends MemberEntityReference> implements CommunityVisa {
  constructor(private root: root, private member: MemberEntityReference) {}  
  
  determineIf(func:((permissions:CommunityPermissionsSpec) => boolean)) :  boolean {
    //ensure that the member is a member of this community
    if(!this.member || this.member.community.id !== this.root.community.id) {
      console.log("Member Visa: member is not a member of this community", this.member, this.root);
      return false;
    }

    const {communityPermissions} = this.member.role.permissions;
    if(!communityPermissions) {
      console.log("Member Visa: no community permissions");
      return false;}

    const updatedPermissions = Object.create(communityPermissions, {
       isEditingOwnMemberAccount : {value: (this.member.id === this.root.id)} // override isEditingOwnMemberAccount
    }) as CommunityPermissionsSpec;
      
    return func(updatedPermissions);
  }
}