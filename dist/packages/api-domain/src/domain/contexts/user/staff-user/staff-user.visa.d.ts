import { PassportSeedwork } from 'cellix-domain-seedwork';
import { StaffUserEntityReference } from './staff-user';
export interface StaffUserPermissionsSpec {
    isEditingOwnAccount?: boolean;
    isSystemAccount?: boolean;
}
export interface StaffUserVisa extends PassportSeedwork.Visa {
    determineIf(func: ((permissions: StaffUserPermissionsSpec) => boolean)): boolean;
}
export declare class StaffUserVisaImpl<root extends StaffUserEntityReference> implements StaffUserVisa {
    private root;
    private user;
    constructor(root: root, user: StaffUserEntityReference);
    determineIf(func: ((permissions: StaffUserPermissionsSpec) => boolean)): boolean;
}
