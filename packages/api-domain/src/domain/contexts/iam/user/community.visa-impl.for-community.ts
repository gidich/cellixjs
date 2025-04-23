import { type CommunityEntityReference } from '../../community/community/community.ts';
import { type MemberEntityReference } from '../../community/member/member.ts';
import { type CommunityVisa } from "../../community/community.visa.ts";
import { type CommunityPermissions } from '../../community/community.permissions.ts';
import { type StaffUserEntityReference } from '../../user/staff-user/staff-user.ts';
import { type EndUserEntityReference } from '../../user/end-user/end-user.ts';

export class CommunityVisaImplForCommunity<root extends CommunityEntityReference> implements CommunityVisa {
  private root: root;
  private member: MemberEntityReference;
  private user: StaffUserEntityReference | EndUserEntityReference;

  constructor(root: root, member: MemberEntityReference, user: StaffUserEntityReference | EndUserEntityReference) {
    this.root = root;
    this.member = member;
    this.user = user;
  }

  determineIf(func: ((permissions: CommunityPermissions) => boolean)): boolean {
    let communityPermissions: CommunityPermissions;
    
    if (this.member && this.member !== null) {
      //ensure that the member is a member of this community
      if ( this.member.community.id !== this.root.id) {
        console.log("member is not a member of this community");
        return false;
      }
      communityPermissions = this.member.role.permissions.communityPermissions;
    } else if (this.user && this.user !== null && this.user.userType === 'internal-staff') {
      //ensure that the user is a staff user
      const user = this.user as StaffUserEntityReference;
      communityPermissions = user.role.permissions.communityPermissions
    }

    if (!communityPermissions) {
      console.log("no community permissions");
      return false;
    }
    console.log("communityPermissions", communityPermissions);
    return func(communityPermissions);
  }
}
