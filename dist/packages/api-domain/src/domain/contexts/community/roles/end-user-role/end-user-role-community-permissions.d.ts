import { CommunityVisa } from "../../community.visa";
import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface EndUserRoleCommunityPermissionsSpec {
    canManageRolesAndPermissions?: boolean;
    canManageCommunitySettings?: boolean;
    canManageSiteContent?: boolean;
    canManageMembers?: boolean;
    canEditOwnMemberProfile?: boolean;
    canEditOwnMemberAccounts?: boolean;
    isEditingOwnMemberAccount?: boolean;
    isSystemAccount?: boolean;
}
export interface EndUserRoleCommunityPermissionsProps extends EndUserRoleCommunityPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class EndUserRoleCommunityPermissions extends DomainSeedwork.ValueObject<EndUserRoleCommunityPermissionsProps> implements EndUserRoleCommunityPermissionsEntityReference {
    private visa;
    constructor(props: EndUserRoleCommunityPermissionsProps, visa: CommunityVisa);
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
export interface EndUserRoleCommunityPermissionsEntityReference extends Readonly<EndUserRoleCommunityPermissionsProps> {
}
