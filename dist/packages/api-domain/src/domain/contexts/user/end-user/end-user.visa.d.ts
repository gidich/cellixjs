import { PassportSeedwork } from 'cellix-domain-seedwork';
import { EndUserEntityReference } from './end-user';
export interface EndUserPermissionsSpec {
    isEditingOwnAccount: boolean;
}
export interface EndUserVisa extends PassportSeedwork.Visa {
    determineIf(func: ((permissions: EndUserPermissionsSpec) => boolean)): boolean;
}
export declare class EndUserVisaImpl<root extends EndUserEntityReference> implements EndUserVisa {
    private root;
    private user;
    constructor(root: root, user: EndUserEntityReference);
    determineIf(func: ((permissions: EndUserPermissionsSpec) => boolean)): boolean;
}
