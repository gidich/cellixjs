import { PassportSeedwork } from 'cellix-domain-seedwork';
import { VendorUserEntityReference } from './vendor-user';
export interface VendorUserPermissionsSpec {
    isEditingOwnAccount: boolean;
}
export interface VendorUserVisa extends PassportSeedwork.Visa {
    determineIf(func: ((permissions: VendorUserPermissionsSpec) => boolean)): boolean;
}
export declare class VendorUserVisaImpl<root extends VendorUserEntityReference> implements VendorUserVisa {
    private root;
    private user;
    constructor(root: root, user: VendorUserEntityReference);
    determineIf(func: ((permissions: VendorUserPermissionsSpec) => boolean)): boolean;
}
