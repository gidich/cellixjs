import { EndUserRoleCommunityPermissions, EndUserRoleCommunityPermissionsEntityReference, EndUserRoleCommunityPermissionsProps } from './end-user-role-community-permissions';
import { CommunityVisa } from "../../community.visa";
import { EndUserRolePropertyPermissions, EndUserRolePropertyPermissionsEntityReference, EndUserRolePropertyPermissionsProps } from './end-user-role-property-permissions';
import { EndUserRoleServiceTicketPermissions, EndUserRoleServiceTicketPermissionsEntityReference, EndUserRoleServiceTicketPermissionsProps } from './end-user-role-service-ticket-permissions';
import { EndUserRoleServicePermissions, EndUserRoleServicePermissionsEntityReference, EndUserRoleServicePermissionsProps } from './end-user-role-service-permissions';
import { EndUserRoleViolationTicketPermissions, EndUserRoleViolationTicketPermissionsEntityReference, EndUserRoleViolationTicketPermissionsProps } from './end-user-role-violation-ticket-permissions';
import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface EndUserRolePermissionsProps extends DomainSeedwork.ValueObjectProps {
    readonly communityPermissions: EndUserRoleCommunityPermissionsProps;
    readonly propertyPermissions: EndUserRolePropertyPermissionsProps;
    readonly serviceTicketPermissions: EndUserRoleServiceTicketPermissionsProps;
    readonly servicePermissions: EndUserRoleServicePermissionsProps;
    readonly violationTicketPermissions: EndUserRoleViolationTicketPermissionsProps;
}
export interface EndUserRolePermissionsEntityReference extends Readonly<Omit<EndUserRolePermissionsProps, 'communityPermissions' | 'propertyPermissions' | 'serviceTicketPermissions' | 'servicePermissions' | 'violationTicketPermissions'>> {
    readonly communityPermissions: EndUserRoleCommunityPermissionsEntityReference;
    readonly propertyPermissions: EndUserRolePropertyPermissionsEntityReference;
    readonly serviceTicketPermissions: EndUserRoleServiceTicketPermissionsEntityReference;
    readonly servicePermissions: EndUserRoleServicePermissionsEntityReference;
    readonly violationTicketPermissions: EndUserRoleViolationTicketPermissionsEntityReference;
}
export declare class EndUserRolePermissions extends DomainSeedwork.ValueObject<EndUserRolePermissionsProps> implements EndUserRolePermissionsEntityReference {
    private visa;
    constructor(props: EndUserRolePermissionsProps, visa: CommunityVisa);
    get communityPermissions(): EndUserRoleCommunityPermissions;
    get propertyPermissions(): EndUserRolePropertyPermissions;
    get serviceTicketPermissions(): EndUserRoleServiceTicketPermissions;
    get servicePermissions(): EndUserRoleServicePermissions;
    get violationTicketPermissions(): EndUserRoleViolationTicketPermissions;
}
