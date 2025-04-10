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

export interface StaffRolePermissionsEntityReference extends Readonly<Omit<StaffRolePermissionsProps, 
  'communityPermissions' | 'propertyPermissions' | 'serviceTicketPermissions' | 'servicePermissions' | 'violationTicketPermissions' >> {
  readonly communityPermissions: StaffRoleCommunityPermissionsEntityReference;
  readonly propertyPermissions: StaffRolePropertyPermissionsEntityReference;
  readonly serviceTicketPermissions: StaffRoleServiceTicketPermissionsEntityReference;
  readonly servicePermissions: StaffRoleServicePermissionsEntityReference;
  readonly violationTicketPermissions: StaffRoleViolationTicketPermissionsEntityReference;
}

export class StaffRolePermissions extends DomainSeedwork.ValueObject<StaffRolePermissionsProps> implements StaffRolePermissionsEntityReference {
  constructor(props: StaffRolePermissionsProps,private visa:CommunityVisa) { 
    super(props); 
  }

  get communityPermissions(): StaffRoleCommunityPermissions {
    return new StaffRoleCommunityPermissions(this.props.communityPermissions,this.visa);
  }
  get propertyPermissions(): StaffRolePropertyPermissions {
    return new StaffRolePropertyPermissions(this.props.propertyPermissions,this.visa);
  }
  get serviceTicketPermissions(): StaffRoleServiceTicketPermissions {
    return new StaffRoleServiceTicketPermissions(this.props.serviceTicketPermissions,this.visa);
  }
  get servicePermissions(): StaffRoleServicePermissions {
    return new StaffRoleServicePermissions(this.props.servicePermissions,this.visa);
  }
  get violationTicketPermissions(): StaffRoleViolationTicketPermissions {
    return new StaffRoleViolationTicketPermissions(this.props.violationTicketPermissions,this.visa);
  }
}