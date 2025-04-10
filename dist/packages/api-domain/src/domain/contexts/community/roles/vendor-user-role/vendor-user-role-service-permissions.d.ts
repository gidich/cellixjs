import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface VendorUserRoleServicePermissionsSpec {
    canManageServices?: boolean;
    isSystemAccount?: boolean;
}
export interface VendorUserRoleServicePermissionsProps extends VendorUserRoleServicePermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class VendorUserRoleServicePermissions extends DomainSeedwork.ValueObject<VendorUserRoleServicePermissionsProps> implements VendorUserRoleServicePermissionsEntityReference {
    private visa;
    constructor(props: VendorUserRoleServicePermissionsProps, visa: CommunityVisa);
    get canManageServices(): boolean;
    get isSystemAccount(): boolean;
    set CanManageServices(value: boolean);
}
export interface VendorUserRoleServicePermissionsEntityReference extends Readonly<VendorUserRoleServicePermissionsProps> {
}
