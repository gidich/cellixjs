import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';



export interface StaffRoleCommunityPermissionsSpec {
  canManageStaffRolesAndPermissions: boolean;
  canManageAllCommunities: boolean
  canDeleteCommunities: boolean;
  canChangeCommunityOwner: boolean;
  canReIndexSearchCollections: boolean;
}


export interface StaffRoleCommunityPermissionsProps extends StaffRoleCommunityPermissionsSpec, DomainSeedwork.ValueObjectProps {}
export interface StaffRoleCommunityPermissionsEntityReference extends Readonly<StaffRoleCommunityPermissionsProps> {}


export class StaffRoleCommunityPermissions extends DomainSeedwork.ValueObject<StaffRoleCommunityPermissionsProps> implements StaffRoleCommunityPermissionsEntityReference {
  private visa: UserVisa;

  constructor(props: StaffRoleCommunityPermissionsProps, visa: UserVisa) {
    super(props);
    this.visa = visa;
  }

  private validateVisa() {
    
    if (!this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) {
      throw new  DomainSeedwork.PermissionError('Cannot set permission');
    }
      
  }

  get canManageStaffRolesAndPermissions(): boolean {
    return this.props.canManageStaffRolesAndPermissions;
  }
  set CanManageStaffRolesAndPermissions(value: boolean) {
    this.validateVisa();
    this.props.canManageStaffRolesAndPermissions = value;
  }
  get canManageAllCommunities(): boolean {
    return this.props.canManageAllCommunities;
  }
  set CanManageAllCommunities(value: boolean) {
    this.validateVisa();
    this.props.canManageAllCommunities = value;
  }
  get canDeleteCommunities(): boolean {
    return this.props.canDeleteCommunities
  }
  set CanDeleteCommunities(value: boolean) {
    this.validateVisa();
    this.props.canDeleteCommunities = value;
  }
  get canChangeCommunityOwner(): boolean {
    return this.props.canChangeCommunityOwner;
  }
  set CanChangeCommunityOwner(value: boolean) {
    this.validateVisa();
    this.props.canChangeCommunityOwner = value;
  }
  get canReIndexSearchCollections(): boolean {
    return this.props.canReIndexSearchCollections;
  }
  set CanReIndexSearchCollections(value: boolean) {
    this.validateVisa();
    this.props.canReIndexSearchCollections = value;
  }
}