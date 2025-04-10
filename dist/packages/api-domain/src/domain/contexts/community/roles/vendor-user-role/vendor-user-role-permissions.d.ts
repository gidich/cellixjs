import { VendorUserRoleCommunityPermissions, VendorUserRoleCommunityPermissionsEntityReference, VendorUserRoleCommunityPermissionsProps } from './vendor-user-role-community-permissions';
import { CommunityVisa } from "../../community.visa";
import { VendorUserRolePropertyPermissions, VendorUserRolePropertyPermissionsEntityReference, VendorUserRolePropertyPermissionsProps } from './vendor-user-role-property-permissions';
import { VendorUserRoleServiceTicketPermissions, VendorUserRoleServiceTicketPermissionsEntityReference, VendorUserRoleServiceTicketPermissionsProps } from './vendor-user-role-service-ticket-permissions';
import { VendorUserRoleServicePermissions, VendorUserRoleServicePermissionsEntityReference, VendorUserRoleServicePermissionsProps } from './vendor-user-role-service-permissions';
import { VendorUserRoleViolationTicketPermissions, VendorUserRoleViolationTicketPermissionsEntityReference, VendorUserRoleViolationTicketPermissionsProps } from './vendor-user-role-violation-ticket-permissions';
import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface VendorUserRolePermissionsProps extends DomainSeedwork.ValueObjectProps {
    readonly communityPermissions: VendorUserRoleCommunityPermissionsProps;
    readonly propertyPermissions: VendorUserRolePropertyPermissionsProps;
    readonly serviceTicketPermissions: VendorUserRoleServiceTicketPermissionsProps;
    readonly servicePermissions: VendorUserRoleServicePermissionsProps;
    readonly violationTicketPermissions: VendorUserRoleViolationTicketPermissionsProps;
}
export interface VendorUserRolePermissionsEntityReference extends Readonly<Omit<VendorUserRolePermissionsProps, 'communityPermissions' | 'propertyPermissions' | 'serviceTicketPermissions' | 'servicePermissions' | 'violationTicketPermissions'>> {
    readonly communityPermissions: VendorUserRoleCommunityPermissionsEntityReference;
    readonly propertyPermissions: VendorUserRolePropertyPermissionsEntityReference;
    readonly serviceTicketPermissions: VendorUserRoleServiceTicketPermissionsEntityReference;
    readonly servicePermissions: VendorUserRoleServicePermissionsEntityReference;
    readonly violationTicketPermissions: VendorUserRoleViolationTicketPermissionsEntityReference;
}
export declare class VendorUserRolePermissions extends DomainSeedwork.ValueObject<VendorUserRolePermissionsProps> implements VendorUserRolePermissionsEntityReference {
    private visa;
    constructor(props: VendorUserRolePermissionsProps, visa: CommunityVisa);
    get communityPermissions(): VendorUserRoleCommunityPermissions;
    get propertyPermissions(): VendorUserRolePropertyPermissions;
    get serviceTicketPermissions(): VendorUserRoleServiceTicketPermissions;
    get servicePermissions(): VendorUserRoleServicePermissions;
    get violationTicketPermissions(): VendorUserRoleViolationTicketPermissions;
}
