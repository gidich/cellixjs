import { DomainSeedwork } from 'api-data-sources-seedwork';
import { CommunityVisa } from "../../community.visa";

export interface StaffRoleCommunityPermissionsSpec {
  canManageStaffRolesAndPermissions?: boolean;
  canManageAllCommunities?: boolean
  canDeleteCommunities?: boolean;
  canChangeCommunityOwner?: boolean;
  canReIndexSearchCollections?: boolean;
}

export interface StaffRoleCommunityPermissionsProps extends StaffRoleCommunityPermissionsSpec, DomainSeedwork.ValueObjectProps {}

export class StaffRoleCommunityPermissions extends DomainSeedwork.ValueObject<StaffRoleCommunityPermissionsProps> implements StaffRoleCommunityPermissionsEntityReference {
  constructor(props: StaffRoleCommunityPermissionsProps, private visa: CommunityVisa) {
    super(props);
  }

  get canManageStaffRolesAndPermissions(): boolean {
    return this.props.canManageStaffRolesAndPermissions;
  }
  get canManageAllCommunities(): boolean {
    return this.props.canManageAllCommunities;
  }
  get canDeleteCommunities(): boolean {
    return this.props.canDeleteCommunities
  }
  get canChangeCommunityOwner(): boolean {
    return this.props.canChangeCommunityOwner;
  }
  get canReIndexSearchCollections(): boolean {
    return this.props.canReIndexSearchCollections;
  }

  private validateVisa() {
    if (!this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('Cannot set permission');
    }
  }

  // using setters from TS 5.1

  set CanManageStaffRolesAndPermissions(value: boolean) {
    this.validateVisa();
    this.props.canManageStaffRolesAndPermissions = value;
  }

  set CanManageAllCommunities(value: boolean) {
    this.validateVisa();
    this.props.canManageAllCommunities = value;
  }

  set CanDeleteCommunities(value: boolean) {
    this.validateVisa();
    this.props.canDeleteCommunities = value;
  }

  set CanChangeCommunityOwner(value: boolean) {
    this.validateVisa();
    this.props.canChangeCommunityOwner = value;
  }

  set CanReIndexSearchCollections(value: boolean) {
    this.validateVisa();
    this.props.canReIndexSearchCollections = value;
  }
}

export interface StaffRoleCommunityPermissionsEntityReference extends Readonly<StaffRoleCommunityPermissionsProps> {}



