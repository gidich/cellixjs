import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface StaffRoleCommunityPermissionsSpec {
    canManageStaffRolesAndPermissions?: boolean;
    canManageAllCommunities?: boolean;
    canDeleteCommunities?: boolean;
    canChangeCommunityOwner?: boolean;
    canReIndexSearchCollections?: boolean;
}
export interface StaffRoleCommunityPermissionsProps extends StaffRoleCommunityPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class StaffRoleCommunityPermissions extends DomainSeedwork.ValueObject<StaffRoleCommunityPermissionsProps> implements StaffRoleCommunityPermissionsEntityReference {
    private visa;
    constructor(props: StaffRoleCommunityPermissionsProps, visa: CommunityVisa);
    get canManageStaffRolesAndPermissions(): boolean;
    get canManageAllCommunities(): boolean;
    get canDeleteCommunities(): boolean;
    get canChangeCommunityOwner(): boolean;
    get canReIndexSearchCollections(): boolean;
    private validateVisa;
    set CanManageStaffRolesAndPermissions(value: boolean);
    set CanManageAllCommunities(value: boolean);
    set CanDeleteCommunities(value: boolean);
    set CanChangeCommunityOwner(value: boolean);
    set CanReIndexSearchCollections(value: boolean);
}
export interface StaffRoleCommunityPermissionsEntityReference extends Readonly<StaffRoleCommunityPermissionsProps> {
}
