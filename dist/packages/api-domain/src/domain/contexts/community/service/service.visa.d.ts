import { PassportSeedwork } from 'cellix-domain-seedwork';
import { MemberEntityReference } from '../member/member';
import { StaffRoleServicePermissionsSpec } from '../roles/staff-role/staff-role-service-permissions';
import { EndUserRoleServicePermissionsSpec } from '../roles/end-user-role/end-user-role-service-permissions';
import { ServiceEntityReference } from './service';
export interface ServicePermissionsSpec extends StaffRoleServicePermissionsSpec, EndUserRoleServicePermissionsSpec {
}
export interface ServiceVisa extends PassportSeedwork.Visa {
    determineIf(func: ((permissions: ServicePermissionsSpec) => boolean)): boolean;
}
export declare class ServiceVisaImpl<root extends ServiceEntityReference> implements ServiceVisa {
    private root;
    private member;
    constructor(root: root, member: MemberEntityReference);
    determineIf(func: ((permissions: ServicePermissionsSpec) => boolean)): boolean;
}
