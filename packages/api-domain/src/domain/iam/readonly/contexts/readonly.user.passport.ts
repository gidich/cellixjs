
import type { EndUserEntityReference } from '../../../contexts/user/end-user/index.ts';
import type { StaffRoleEntityReference } from '../../../contexts/user/staff-role/staff-role.ts';
import type { StaffUserEntityReference } from '../../../contexts/user/staff-user/index.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';
import type { VendorUserEntityReference } from '../../../contexts/user/vendor-user/vendor-user.ts';
import { ReadOnlyPassportBase } from '../readonly.passport-base.ts';

export class ReadOnlyUserPassport
	extends ReadOnlyPassportBase
	implements UserPassport
{
	forEndUser(_root: EndUserEntityReference): UserVisa {
		return { determineIf: () => true };
	}

    forStaffUser(_root: StaffUserEntityReference): UserVisa {
        return { determineIf: () => true };
    }

    forStaffRole(_root: StaffRoleEntityReference): UserVisa {
        throw new Error('Not implemented');
    }

    forVendorUser(_root: VendorUserEntityReference): UserVisa {
        throw new Error('Not implemented');
    }
}
