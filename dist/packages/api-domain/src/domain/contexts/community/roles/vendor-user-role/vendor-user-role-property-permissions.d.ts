import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface VendorUserRolePropertyPermissionsSpec {
    canManageProperties?: boolean;
    canEditOwnProperty?: boolean;
    isEditingOwnProperty?: boolean;
    isSystemAccount?: boolean;
}
export interface VendorUserRolePropertyPermissionsProps extends VendorUserRolePropertyPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class VendorUserRolePropertyPermissions extends DomainSeedwork.ValueObject<VendorUserRolePropertyPermissionsProps> implements VendorUserRolePropertyPermissionsEntityReference {
    private visa;
    constructor(props: VendorUserRolePropertyPermissionsProps, visa: CommunityVisa);
    get canManageProperties(): boolean;
    get canEditOwnProperty(): boolean;
    get isEditingOwnProperty(): boolean;
    get isSystemAccount(): boolean;
    set CanManageProperties(value: boolean);
    set CanEditOwnProperty(value: boolean);
}
export interface VendorUserRolePropertyPermissionsEntityReference extends Readonly<VendorUserRolePropertyPermissionsProps> {
}
