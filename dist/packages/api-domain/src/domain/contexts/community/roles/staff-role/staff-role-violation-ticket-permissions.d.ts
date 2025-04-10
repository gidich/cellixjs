import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface StaffRoleViolationTicketPermissionsSpec {
}
export interface StaffRoleViolationTicketPermissionsProps extends StaffRoleViolationTicketPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class StaffRoleViolationTicketPermissions extends DomainSeedwork.ValueObject<StaffRoleViolationTicketPermissionsProps> implements StaffRoleViolationTicketPermissionsEntityReference {
    private visa;
    constructor(props: StaffRoleViolationTicketPermissionsProps, visa: CommunityVisa);
}
export interface StaffRoleViolationTicketPermissionsEntityReference extends Readonly<StaffRoleViolationTicketPermissionsProps> {
}
