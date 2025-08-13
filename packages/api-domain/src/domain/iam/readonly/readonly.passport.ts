import type { CommunityPassport } from '../../contexts/community/community.passport.ts';
import type { Passport } from '../../contexts/passport.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import { ReadOnlyCommunityPassport } from './contexts/readonly.community.passport.ts';
import { ReadOnlyPassportBase } from './readonly.passport-base.ts';
import { ReadOnlyUserPassport } from './contexts/readonly.user.passport.ts';

export class ReadOnlyPassport extends ReadOnlyPassportBase implements Passport {
    private _communityPassport: CommunityPassport | undefined;
    private _userPassport: UserPassport | undefined;

    public get community(): CommunityPassport {
        if (!this._communityPassport) {
            this._communityPassport = new ReadOnlyCommunityPassport();
        }
        return this._communityPassport;
    }

    public get service(): never {
        throw new Error('Service passport is not available for ReadOnlyPassport');
    }

    public get user(): UserPassport {
        if (!this._userPassport) {
            this._userPassport = new ReadOnlyUserPassport();
        }
        return this._userPassport;
    }
}
