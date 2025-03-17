import { VendorUserRoleCommunityPermissions, VendorUserRoleCommunityPermissionsEntityReference, VendorUserRoleCommunityPermissionsProps } from './vendor-user-role-community-permissions';
import { CommunityVisa } from "../../community.visa";
import { VendorUserRolePropertyPermissions, VendorUserRolePropertyPermissionsEntityReference, VendorUserRolePropertyPermissionsProps } from './vendor-user-role-property-permissions';
import { VendorUserRoleServiceTicketPermissions, VendorUserRoleServiceTicketPermissionsEntityReference, VendorUserRoleServiceTicketPermissionsProps } from './vendor-user-role-service-ticket-permissions';
import { VendorUserRoleServicePermissions, VendorUserRoleServicePermissionsEntityReference, VendorUserRoleServicePermissionsProps } from './vendor-user-role-service-permissions';
import { VendorUserRoleViolationTicketPermissions, VendorUserRoleViolationTicketPermissionsEntityReference, VendorUserRoleViolationTicketPermissionsProps } from './vendor-user-role-violation-ticket-permissions';
import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface VendorUserRolePermissionsProps extends DomainSeedwork.ValueObjectProps {
  readonly communityPermissions: VendorUserRoleCommunityPermissionsProps;
  readonly propertyPermissions: VendorUserRolePropertyPermissionsProps;
  readonly serviceTicketPermissions: VendorUserRoleServiceTicketPermissionsProps;
  readonly servicePermissions: VendorUserRoleServicePermissionsProps;
  readonly violationTicketPermissions: VendorUserRoleViolationTicketPermissionsProps;
}

export interface VendorUserRolePermissionsEntityReference extends Readonly<Omit<VendorUserRolePermissionsProps, 
  'communityPermissions' | 'propertyPermissions' | 'serviceTicketPermissions' | 'servicePermissions' | 'violationTicketPermissions' >> {
  readonly communityPermissions: VendorUserRoleCommunityPermissionsEntityReference;
  readonly propertyPermissions: VendorUserRolePropertyPermissionsEntityReference;
  readonly serviceTicketPermissions: VendorUserRoleServiceTicketPermissionsEntityReference;
  readonly servicePermissions: VendorUserRoleServicePermissionsEntityReference;
  readonly violationTicketPermissions: VendorUserRoleViolationTicketPermissionsEntityReference;
}

export class VendorUserRolePermissions extends DomainSeedwork.ValueObject<VendorUserRolePermissionsProps> implements VendorUserRolePermissionsEntityReference {
  constructor(props: VendorUserRolePermissionsProps,private visa:CommunityVisa) { 
    super(props); 
  }

  get communityPermissions(): VendorUserRoleCommunityPermissions {
    return new VendorUserRoleCommunityPermissions(this.props.communityPermissions,this.visa);
  }
  get propertyPermissions(): VendorUserRolePropertyPermissions {
    return new VendorUserRolePropertyPermissions(this.props.propertyPermissions,this.visa);
  }
  get serviceTicketPermissions(): VendorUserRoleServiceTicketPermissions {
    return new VendorUserRoleServiceTicketPermissions(this.props.serviceTicketPermissions,this.visa);
  }
  get servicePermissions(): VendorUserRoleServicePermissions {
    return new VendorUserRoleServicePermissions(this.props.servicePermissions,this.visa);
  }
  get violationTicketPermissions(): VendorUserRoleViolationTicketPermissions {
    return new VendorUserRoleViolationTicketPermissions(this.props.violationTicketPermissions,this.visa);
  }
}