import type { CommunityPassport } from './community/community.passport.ts';
import type { ServicePassport } from './service/service.passport.ts';
import type { UserPassport } from './user/user.passport.ts';

export interface Passport {
  get community(): CommunityPassport;
  get service(): ServicePassport;
  get user(): UserPassport;
}