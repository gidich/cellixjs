import { EndUserRolePermissions, type EndUserRolePermissionsEntityReference, type EndUserRolePermissionsProps } from './end-user-role-permissions.ts';
import * as ValueObjects from './end-user-role.value-objects.ts';
import { Community, type CommunityProps, type CommunityEntityReference } from '../../community/community.ts';
import type { CommunityVisa } from "../../community.visa.ts";
import type { DomainExecutionContext } from '../../../../domain-execution-context.ts';
import { RoleDeletedReassignEvent } from '../../../../events/types/role-deleted-reassign.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface EndUserRoleProps extends DomainSeedwork.DomainEntityProps {
  roleName: string;
  readonly community: CommunityProps;
  setCommunityRef: (community: CommunityEntityReference) => void;
  isDefault: boolean;
  permissions: EndUserRolePermissionsProps;
  readonly roleType: string | undefined;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
}

export interface EndUserRoleEntityReference extends Readonly<Omit<EndUserRoleProps, 'community' | 'setCommunityRef' | 'permissions'>> {
  readonly community: CommunityEntityReference;
  readonly permissions: EndUserRolePermissionsEntityReference;
}

export class EndUserRole<props extends EndUserRoleProps> extends DomainSeedwork.AggregateRoot<props> implements EndUserRoleEntityReference {
  private isNew: boolean = false;
  visa: CommunityVisa;
  private readonly context: DomainExecutionContext;

  constructor(props: props, context: DomainExecutionContext) {
    super(props);
    this.context = context;
    this.visa = context.domainVisa.forCommunity(this.community);
  }

  get roleName() {
    return this.props.roleName;
  }
  set roleName(roleName: string) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('Cannot set role name');
    }
    this.props.roleName = new ValueObjects.RoleName(roleName).valueOf();
  }

  get community(): CommunityEntityReference {
    return new Community(this.props.community, this.context);
  }
  private set community(community: CommunityEntityReference) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('You do not have permission to update this role');
    }
    this.props.setCommunityRef(community);
  }
  get isDefault() {
    return this.props.isDefault;
  }
  set isDefault(isDefault: boolean) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions || permissions.isSystemAccount)) {
      throw new Error('You do not have permission to update this role');
    }
    this.props.isDefault = isDefault;
  }
  get permissions() {
    return new EndUserRolePermissions(this.props.permissions, this.visa);
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

  public static getNewInstance<props extends EndUserRoleProps>(
    newProps: props,
    roleName: string,
    isDefault: boolean,
    community: CommunityEntityReference,
    context: DomainExecutionContext
  ): EndUserRole<props> {
    const role = new EndUserRole(newProps, context);
    role.isNew = true;
    role.roleName = roleName;
    role.community = community;
    role.isDefault = isDefault;
    role.isNew = false;
    return role;
  }
  deleteAndReassignTo(roleRef: EndUserRoleEntityReference) {
    if (!this.isDeleted && !this.isDefault && !this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('You do not have permission to delete this role');
    }
    super.isDeleted = true;
    this.addIntegrationEvent(RoleDeletedReassignEvent, { deletedRoleId: this.props.id, newRoleId: roleRef.id });
  }
}
