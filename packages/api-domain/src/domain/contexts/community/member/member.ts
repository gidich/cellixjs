import { DomainSeedwork } from 'cellix-domain-seedwork';

//import { AggregateRoot } from '../../../../../../seedwork/domain-seedwork/aggregate-root';
//import { DomainEntityProps } from '../../../../../../seedwork/domain-seedwork/domain-entity';
import * as ValueObjects from './member.value-objects';
import { Community, CommunityProps, CommunityEntityReference } from '../community/community';
//import { PropArray } from '../../../../../../seedwork/domain-seedwork/prop-array';
import { MemberAccount, MemberAccountEntityReference, MemberAccountProps } from './member-account';
import { EndUserRole, EndUserRoleEntityReference, EndUserRoleProps } from '../roles/end-user-role/end-user-role';
import { DomainExecutionContext, SystemDomainExecutionContext } from '../../../domain-execution-context';
import { MemberProfile, MemberProfileEntityReference, MemberProfileProps } from './member-profile';
import { CommunityVisa } from "../community.visa";
import { MemberCustomView, MemberCustomViewEntityReference, MemberCustomViewProps } from './member-custom-view';

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
  private isNew: boolean = false;
  private readonly visa: CommunityVisa;
  constructor(props: props, private readonly context: DomainExecutionContext) {
    super(props);
  }

  get id() {
    return this.props.id;
  }
  get memberName() {
    return this.props.memberName;
  }

  get cybersourceCustomerId() {
    return this.props.cybersourceCustomerId;
  }

  get community(): CommunityEntityReference {
    return new Community(this.props.community, this.context);
  }
  get accounts(): ReadonlyArray<MemberAccount> {
    return this.props.accounts.items.map((account) => new MemberAccount(account, this.context, this.visa));
  } // return account as it's an embedded document not a reference (allows editing)
  get role(): EndUserRoleEntityReference {
    return new EndUserRole(this.props.role, this.context);
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

  public static getNewInstance<props extends MemberProps>(newProps: props, name: string, community: CommunityEntityReference, context: DomainExecutionContext): Member<props> {
    let member = new Member(newProps, context);
    member.isNew = true;
    member.MemberName = name;
    member.Community = community;
    member.isNew = false;
    return member;
  }
  // using SET from TS 5.1

  set MemberName(memberName: string) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
      throw new Error('Cannot set member name');
    }
    this.props.memberName = new ValueObjects.MemberName(memberName).valueOf();
  }

  set CyberSourceCustomerId(cybersourceCustomerId: string) {
    this.props.cybersourceCustomerId = new ValueObjects.CyberSourceCustomerId(cybersourceCustomerId).valueOf();
  }
  
  set Community(community: CommunityEntityReference) {
    this.props.setCommunityRef(community);
  }

  set Role(role: EndUserRoleEntityReference) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
      throw new Error('Cannot set role');
    }
    this.props.setRoleRef(role);
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
  // CustomViews
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
}
