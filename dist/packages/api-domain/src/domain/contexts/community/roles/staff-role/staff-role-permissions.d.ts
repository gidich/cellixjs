import { DomainSeedwork } from 'cellix-domain-seedwork';
import { StaffRoleCommunityPermissions, StaffRoleCommunityPermissionsEntityReference, StaffRoleCommunityPermissionsProps } from './staff-role-community-permissions';
import { CommunityVisa } from "../../community.visa";
import { StaffRolePropertyPermissions, StaffRolePropertyPermissionsEntityReference, StaffRolePropertyPermissionsProps } from './staff-role-property-permissions';
import { StaffRoleServiceTicketPermissions, StaffRoleServiceTicketPermissionsEntityReference, StaffRoleServiceTicketPermissionsProps } from './staff-role-service-ticket-permissions';
import { StaffRoleServicePermissions, StaffRoleServicePermissionsEntityReference, StaffRoleServicePermissionsProps } from './staff-role-service-permissions';
import { StaffRoleViolationTicketPermissions, StaffRoleViolationTicketPermissionsEntityReference, StaffRoleViolationTicketPermissionsProps } from './staff-role-violation-ticket-permissions';
export interface StaffRolePermissionsProps extends DomainSeedwork.ValueObjectProps {
    readonly communityPermissions: StaffRoleCommunityPermissionsProps;
    readonly propertyPermissions: StaffRolePropertyPermissionsProps;
    readonly serviceTicketPermissions: StaffRoleServiceTicketPermissionsProps;
    readonly servicePermissions: StaffRoleServicePermissionsProps;
    readonly violationTicketPermissions: StaffRoleViolationTicketPermissionsProps;
}
export interface StaffRolePermissionsEntityReference extends Readonly<Omit<StaffRolePermissionsProps, 'communityPermissions' | 'propertyPermissions' | 'serviceTicketPermissions' | 'servicePermissions' | 'violationTicketPermissions'>> {
    readonly communityPermissions: StaffRoleCommunityPermissionsEntityReference;
    readonly propertyPermissions: StaffRolePropertyPermissionsEntityReference;
    readonly serviceTicketPermissions: StaffRoleServiceTicketPermissionsEntityReference;
    readonly servicePermissions: StaffRoleServicePermissionsEntityReference;
    readonly violationTicketPermissions: StaffRoleViolationTicketPermissionsEntityReference;
}
export declare class StaffRolePermissions extends DomainSeedwork.ValueObject<StaffRolePermissionsProps> implements StaffRolePermissionsEntityReference {
    private visa;
    constructor(props: StaffRolePermissionsProps, visa: CommunityVisa);
    get communityPermissions(): StaffRoleCommunityPermissions;
    get propertyPermissions(): StaffRolePropertyPermissions;
    get serviceTicketPermissions(): StaffRoleServiceTicketPermissions;
    get servicePermissions(): StaffRoleServicePermissions;
    get violationTicketPermissions(): StaffRoleViolationTicketPermissions;
}
