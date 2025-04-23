import { PassportSeedwork } from '@cellix/domain-seedwork';
import { type CommunityPermissions } from './community.permissions.ts';

export interface CommunityVisa extends PassportSeedwork.Visa {
  determineIf(func: ((permissions: CommunityPermissions) => boolean)): boolean;
}
