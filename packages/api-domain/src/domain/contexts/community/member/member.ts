import { DomainSeedwork } from '@cellix/domain-seedwork';
import * as ValueObjects from './member.value-objects.ts';
import { Community, type CommunityProps, type CommunityEntityReference } from '../community/community.ts';
import { MemberAccount, type MemberAccountEntityReference, type MemberAccountProps } from './member-account.ts';
import { EndUserRole, type EndUserRoleEntityReference, type EndUserRoleProps } from '../roles/end-user-role/end-user-role.ts';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';
import { MemberProfile, type MemberProfileEntityReference, type MemberProfileProps } from './member-profile.ts';
import type { CommunityVisa } from '../community.visa.ts';
import { MemberCustomView, type MemberCustomViewEntityReference, type MemberCustomViewProps } from './member-custom-view.ts';

export interface MemberProps extends DomainSeedwork.DomainEntityProps {
  memberName: string;
  cybersourceCustomerId: string;
  readonly community: CommunityProps;
  setCommunityRef: (community: CommunityEntityReference) => void;
  readonly accounts: DomainSeedwork.PropArray<MemberAccountProps>;
  readonly role: EndUserRoleProps;
  setRoleRef: (role: EndUserRoleEntityReference) => void;
  readonly profile: MemberProfileProps;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
  readonly customViews: DomainSeedwork.PropArray<MemberCustomViewProps>;
}

export interface MemberEntityReference extends Readonly<Omit<MemberProps, 'community' | 'setCommunityRef' | 'accounts' | 'role' | 'setRoleRef' | 'profile' | 'customViews'>> {
  readonly community: CommunityEntityReference;
  readonly accounts: ReadonlyArray<MemberAccountEntityReference>;
  readonly role: EndUserRoleEntityReference;
  readonly profile: MemberProfileEntityReference;
  readonly customViews: ReadonlyArray<MemberCustomViewEntityReference>;
}

export class Member<props extends MemberProps> extends DomainSeedwork.AggregateRoot<props> implements MemberEntityReference {
  //#region Fields
  private isNew: boolean = false;
  private readonly visa: CommunityVisa;
  private readonly context: DomainExecutionContext;
  //#endregion Fields

  //#region Constructors
  constructor(props: props, context: DomainExecutionContext) {
    super(props);
    this.context = context;
    this.visa = context.domainVisa.forCommunity(this.community);
  }
  //#endregion Constructors

  //#region Methods
  public static getNewInstance<props extends MemberProps>(newProps: props, name: string, community: CommunityEntityReference, context: DomainExecutionContext): Member<props> {
    let member = new Member(newProps, context);
    member.isNew = true;
    member.memberName = name;
    member.community = community;
    member.isNew = false;
    return member;
  }
 

  public requestNewAccount(): MemberAccount {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
      throw new Error('Cannot set role');
    }
    return new MemberAccount(this.props.accounts.getNewItem(), this.context, this.visa);
  }

  public requestRemoveAccount(accountRef: MemberAccountProps): void {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
      throw new Error('Cannot set role');
    }
    this.props.accounts.removeItem(accountRef);
  }

  public requestNewCustomView(): MemberCustomView {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
      throw new Error('Cannot set custom view');
    }
    return new MemberCustomView(this.props.customViews.getNewItem(), this.context, this.visa);
  }

  public requestRemoveCustomView(customView: MemberCustomView): void {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
      throw new Error('Cannot set custom view');
    }
    console.log(customView.name);
    this.props.customViews.removeItem(customView.props);
  }
  //#endregion Methods

  //#region Properties
  get memberName() {
    return this.props.memberName;
  }
  set memberName(memberName: string) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
      throw new Error('Cannot set member name');
    }
    this.props.memberName = new ValueObjects.MemberName(memberName).valueOf();
  }

  get cybersourceCustomerId() {
    return this.props.cybersourceCustomerId;
  }
  //TODO: why is this not security checked?
  set cyberSourceCustomerId(cybersourceCustomerId: string) {
    this.props.cybersourceCustomerId = new ValueObjects.CyberSourceCustomerId(cybersourceCustomerId).valueOf();
  }

  get community(): CommunityEntityReference {
    return new Community(this.props.community, this.context);
  }
  //TODO: why is this not security checked?
  set community(community: CommunityEntityReference) {
    this.props.setCommunityRef(community);
  }

  get accounts(): ReadonlyArray<MemberAccount> {
    return this.props.accounts.items.map((account) => new MemberAccount(account, this.context, this.visa));
  } // return account as it's an embedded document not a reference (allows editing)

  get role(): EndUserRoleEntityReference {
    return new EndUserRole(this.props.role, this.context);
  }
  set role(role: EndUserRoleEntityReference) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
      throw new Error('Cannot set role');
    }
    this.props.setRoleRef(role);
  }

  get profile() {
    return new MemberProfile(this.props.profile, this.visa);
  } // return profile as it's an embedded document not a reference (allows editing)

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get schemaVersion() {
    return this.props.schemaVersion;
  }

  get customViews(): ReadonlyArray<MemberCustomView> {
    return this.props.customViews.items.map((customView) => new MemberCustomView(customView, this.context, this.visa));
  } // return customView as it's an embedded document not a reference (allows editing)
  // #endregion Properties
}