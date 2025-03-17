import { CommunityEntityReference } from './community';
import { MemberEntityReference } from '../member/member';
import { CommunityVisa, CommunityPermissionsSpec } from "../community.visa";
import { StaffUserEntityReference } from '../../user/staff-user/staff-user';
import { EndUserEntityReference } from '../../user/end-user/end-user';

export class CommunityVisaImplForCommunity<root extends CommunityEntityReference> implements CommunityVisa {
  constructor(private root: root, private member: MemberEntityReference, private user: StaffUserEntityReference|EndUserEntityReference) {
  }

  determineIf(func: ((permissions: CommunityPermissionsSpec) => boolean)): boolean {
    let communityPermissions: CommunityPermissionsSpec;
    
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
