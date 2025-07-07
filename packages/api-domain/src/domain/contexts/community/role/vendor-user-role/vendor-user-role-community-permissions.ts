import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { CommunityVisa } from '../../community.visa.ts';
import type { CommunityDomainPermissions } from '../../community.domain-permissions.ts';

export interface VendorUserRoleCommunityPermissionsSpec
  extends Omit<CommunityDomainPermissions, 'canCreateCommunities' | 'isEditingOwnMemberAccount' | 'isSystemAccount' | 'canManageVendorUserRolesAndPermissions'>,
    DomainSeedwork.ValueObjectProps {}

export interface VendorUserRoleCommunityPermissionsProps extends VendorUserRoleCommunityPermissionsSpec, DomainSeedwork.ValueObjectProps {}

export class VendorUserRoleCommunityPermissions extends DomainSeedwork.ValueObject<VendorUserRoleCommunityPermissionsProps> implements VendorUserRoleCommunityPermissionsEntityReference {
  private readonly visa: CommunityVisa;
  constructor(props: VendorUserRoleCommunityPermissionsProps, visa: CommunityVisa) {
    super(props);
    this.visa = visa;
  }

  get canManageEndUserRolesAndPermissions(): boolean {
    return this.props.canManageEndUserRolesAndPermissions;
  }
  get canManageCommunitySettings(): boolean {
    return this.props.canManageCommunitySettings;
  }
  get canManageSiteContent(): boolean {
    return this.props.canManageSiteContent;
  }
  get canManageMembers(): boolean {
    return this.props.canManageMembers;
  }
  get canEditOwnMemberProfile(): boolean {
    return this.props.canEditOwnMemberProfile;
  }
  get canEditOwnMemberAccounts(): boolean {
    return this.props.canEditOwnMemberAccounts;
  }

  // using setters from TS 5.1

  set CanManageRolesAndPermissions(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new DomainSeedwork.PermissionError('Cannot set permission1');
    }
    this.props.canManageEndUserRolesAndPermissions = value;
  }

  set CanManageCommunitySettings(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new DomainSeedwork.PermissionError('Cannot set permission2');
    }
    this.props.canManageCommunitySettings = value;
  }

  set CanManageSiteContent(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new DomainSeedwork.PermissionError('Cannot set permission3');
    }
    this.props.canManageSiteContent = value;
  }

  set CanManageMembers(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new DomainSeedwork.PermissionError('Cannot set permission');
    }
    this.props.canManageMembers = value;
  }

  set CanEditOwnMemberProfile(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new DomainSeedwork.PermissionError('Cannot set permission');
    }
    this.props.canEditOwnMemberProfile = value;
  }

  set CanEditOwnMemberAccounts(value: boolean) {
    if (!this.visa.determineIf((permissions) => permissions.canManageEndUserRolesAndPermissions || permissions.isSystemAccount)) {
      throw new DomainSeedwork.PermissionError('Cannot set permission');
    }
    this.props.canEditOwnMemberAccounts = value;
  }
}

export interface VendorUserRoleCommunityPermissionsEntityReference extends Readonly<VendorUserRoleCommunityPermissionsProps> {}
