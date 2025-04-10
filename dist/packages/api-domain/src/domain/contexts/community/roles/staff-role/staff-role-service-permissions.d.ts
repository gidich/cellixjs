import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface StaffRoleServicePermissionsSpec {
}
export interface StaffRoleServicePermissionsProps extends StaffRoleServicePermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class StaffRoleServicePermissions extends DomainSeedwork.ValueObject<StaffRoleServicePermissionsProps> implements StaffRoleServicePermissionsEntityReference {
    private visa;
    constructor(props: StaffRoleServicePermissionsProps, visa: CommunityVisa);
}
export interface StaffRoleServicePermissionsEntityReference extends Readonly<StaffRoleServicePermissionsProps> {
}
