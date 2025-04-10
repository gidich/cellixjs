import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface StaffRoleServiceTicketPermissionsSpec {
}
export interface StaffRoleServiceTicketPermissionsProps extends StaffRoleServiceTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class StaffRoleServiceTicketPermissions extends DomainSeedwork.ValueObject<StaffRoleServiceTicketPermissionsProps> implements StaffRoleServiceTicketPermissionsEntityReference {
    private visa;
    constructor(props: StaffRoleServiceTicketPermissionsProps, visa: CommunityVisa);
}
export interface StaffRoleServiceTicketPermissionsEntityReference extends Readonly<StaffRoleServiceTicketPermissionsProps> {
}
