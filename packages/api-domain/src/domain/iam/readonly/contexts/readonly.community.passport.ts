
import type { CommunityEntityReference } from '../../../contexts/community/community/community.ts';
import type { CommunityPassport } from '../../../contexts/community/community.passport.ts';
import type { CommunityVisa } from '../../../contexts/community/community.visa.ts';
import { ReadOnlyPassportBase } from '../readonly.passport-base.ts';

export class ReadOnlyCommunityPassport
	extends ReadOnlyPassportBase
	implements CommunityPassport
{
	forCommunity(_root: CommunityEntityReference): CommunityVisa {
		return { determineIf: () => true };
	}
}
