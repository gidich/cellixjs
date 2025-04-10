import { PassportSeedwork } from 'cellix-domain-seedwork';
import { StaffRoleCommunityPermissionsSpec } from './roles/staff-role/staff-role-community-permissions';
import { EndUserRoleCommunityPermissionsSpec } from './roles/end-user-role/end-user-role-community-permissions';
export interface CommunityPermissionsSpec extends StaffRoleCommunityPermissionsSpec, EndUserRoleCommunityPermissionsSpec {
}
export interface CommunityVisa extends PassportSeedwork.Visa {
    determineIf(func: ((permissions: CommunityPermissionsSpec) => boolean)): boolean;
}
