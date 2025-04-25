//import { DomainEntityProps } from '../../../../../../../seedwork/domain-seedwork/domain-entity';
import { VendorUserRolePermissions, type VendorUserRolePermissionsEntityReference, type VendorUserRolePermissionsProps } from './vendor-user-role-permissions.ts';
import * as ValueObjects from './vendor-user-role.value-objects.ts';
import { Community, type CommunityProps, type CommunityEntityReference } from '../../community/community.ts';
import type { CommunityVisa } from "../../community.visa.ts";
//import { AggregateRoot } from '../../../../../../../seedwork/domain-seedwork/aggregate-root';
//import { AggregateRoot } from '../../../../../../../seedwork/domain-seedwork/aggregate-root';
import type { DomainExecutionContext } from '../../../../domain-execution-context.ts';
import { RoleDeletedReassignEvent } from '../../../../events/types/role-deleted-reassign.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';


export interface VendorUserRoleProps extends DomainSeedwork.DomainEntityProps {
  roleName: string;
  readonly community: CommunityProps;
  setCommunityRef: (community: CommunityEntityReference) => void;
  isDefault: boolean;
  permissions: VendorUserRolePermissionsProps;
  readonly roleType?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
}

export interface VendorUserRoleEntityReference extends Readonly<Omit<VendorUserRoleProps, 'community' | 'setCommunityRef' | 'permissions'>> {
  readonly community: CommunityEntityReference;
  readonly permissions: VendorUserRolePermissionsEntityReference;
}

export class VendorUserRole<props extends VendorUserRoleProps> extends DomainSeedwork.AggregateRoot<props> implements VendorUserRoleEntityReference {
  private isNew: boolean = false;
  private readonly visa: CommunityVisa;
  constructor(props: props, private readonly context: DomainExecutionContext) {
    super(props)
    this.visa = context.domainVisa.forVendorUserRole(this);
  }

  get roleName() {
    return this.props.roleName;
  }
  get community(): CommunityEntityReference {
    return new Community(this.props.community, this.context);
  }
  get isDefault() {
    return this.props.isDefault;
  }
  get permissions() {
    return new VendorUserRolePermissions(this.props.permissions, this.visa);
  }
  get roleType() {
    return this.props.roleType;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get schemaVersion() {
    return this.props.schemaVersion;
  }

  public static getNewInstance<props extends VendorUserRoleProps>(
    newProps: props,
    roleName: string,
    isDefault: boolean,
    community: CommunityEntityReference,
    context: DomainExecutionContext
  ): VendorUserRole<props> {
    const role = new VendorUserRole(newProps, context);
    role.isNew = true;
    role.RoleName = roleName;
    role.Community = community;
    role.IsDefault = isDefault;
    role.isNew = false;
    return role;
  }

  // using setter from TS 5.1

  private set Community(community: CommunityEntityReference) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('You do not have permission to update this role');
    }
    this.props.setCommunityRef(community);
  }

  set DeleteAndReassignTo(roleRef: VendorUserRoleEntityReference) {
    if (!this.isDeleted && !this.isDefault && !this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('You do not have permission to delete this role');
    }
    super.isDeleted = true;
    this.addIntegrationEvent(RoleDeletedReassignEvent, { deletedRoleId: this.props.id, newRoleId: roleRef.id });
  }

  set IsDefault(isDefault: boolean) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('You do not have permission to update this role');
    }
    this.props.isDefault = isDefault;
  }

  set RoleName(roleName: string) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('Cannot set role name');
    }
    this.props.roleName = new ValueObjects.RoleName(roleName).valueOf();
  }
}
