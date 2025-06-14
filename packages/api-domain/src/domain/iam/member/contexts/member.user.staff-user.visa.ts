import type { MemberEntityReference } from '../../../contexts/community/member/member.ts';
import type { StaffUserEntityReference } from '../../../contexts/user/staff-user/staff-user.ts';
import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';

export class MemberUserStaffUserVisa<root extends StaffUserEntityReference> implements UserVisa {
  private readonly root: root;

  // [NN] [ESLINT] temporarily disabling @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(root: root, _member: MemberEntityReference) {
    this.root = root;
  }  
  
  determineIf(func: ((permissions: Readonly<UserDomainPermissions>) => boolean)): boolean {
    const updatedPermissions: UserDomainPermissions = {
      canManageEndUsers: false,
      canManageStaffRolesAndPermissions: false,
      canManageStaffUsers: false,
      canManageVendorUsers: false,
      isEditingOwnAccount: false,
      isSystemAccount: false,
    }

    return func(updatedPermissions);
  }
}