
import type { CommunityEntityReference } from '../../../contexts/community/community/community.ts';
import type { CommunityPassport } from '../../../contexts/community/community.passport.ts';
import type { CommunityVisa } from '../../../contexts/community/community.visa.ts';
import { SystemPassportBase } from '../system.passport-base.ts';

export class SystemCommunityPassport
	extends SystemPassportBase
	implements CommunityPassport
{
	forCommunity(_root: CommunityEntityReference): CommunityVisa {
		return { determineIf: () => true };
	}
}
