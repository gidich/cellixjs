import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface VendorUserRoleCommunityPermissionsSpec {
    canManageRolesAndPermissions?: boolean;
    canManageCommunitySettings?: boolean;
    canManageSiteContent?: boolean;
    canManageMembers?: boolean;
    canEditOwnMemberProfile?: boolean;
    canEditOwnMemberAccounts?: boolean;
    isEditingOwnMemberAccount?: boolean;
    isSystemAccount?: boolean;
}
export interface VendorUserRoleCommunityPermissionsProps extends VendorUserRoleCommunityPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class VendorUserRoleCommunityPermissions extends DomainSeedwork.ValueObject<VendorUserRoleCommunityPermissionsProps> implements VendorUserRoleCommunityPermissionsEntityReference {
    private visa;
    constructor(props: VendorUserRoleCommunityPermissionsProps, visa: CommunityVisa);
    get canManageRolesAndPermissions(): boolean;
    get canManageCommunitySettings(): boolean;
    get canManageSiteContent(): boolean;
    get canManageMembers(): boolean;
    get canEditOwnMemberProfile(): boolean;
    get canEditOwnMemberAccounts(): boolean;
    get isEditingOwnMemberAccount(): boolean;
    get isSystemAccount(): boolean;
    set CanManageRolesAndPermissions(value: boolean);
    set CanManageCommunitySettings(value: boolean);
    set CanManageSiteContent(value: boolean);
    set CanManageMembers(value: boolean);
    set CanEditOwnMemberProfile(value: boolean);
    set CanEditOwnMemberAccounts(value: boolean);
}
export interface VendorUserRoleCommunityPermissionsEntityReference extends Readonly<VendorUserRoleCommunityPermissionsProps> {
}
