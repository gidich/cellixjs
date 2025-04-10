import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface StaffRolePropertyPermissionsSpec {
}
export interface StaffRolePropertyPermissionsProps extends StaffRolePropertyPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class StaffRolePropertyPermissions extends DomainSeedwork.ValueObject<StaffRolePropertyPermissionsProps> implements StaffRolePropertyPermissionsEntityReference {
    private visa;
    constructor(props: StaffRolePropertyPermissionsProps, visa: CommunityVisa);
}
export interface StaffRolePropertyPermissionsEntityReference extends Readonly<StaffRolePropertyPermissionsProps> {
}
