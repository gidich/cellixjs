import { DomainSeedwork } from '@cellix/domain-seedwork';
import { type DomainExecutionContext } from '../../../domain-execution-context.ts';
import { EndUser, type EndUserEntityReference, type EndUserProps } from '../../user/end-user/end-user.ts';
import * as ValueObjects from './member-account.value-objects.ts';
import type { CommunityVisa } from '../community.visa.ts';

export interface MemberAccountProps extends DomainSeedwork.DomainEntityProps {
  firstName: string;
  lastName: string;
  user: EndUserProps;
  setUserRef: (user: EndUserProps) => void;
  statusCode: string;
  createdBy: EndUserProps;
  setCreatedByRef: (createdBy: EndUserProps) => void;
}

export interface MemberAccountEntityReference extends Readonly<Omit<MemberAccountProps, 'user' | 'setUserRef' | 'createdBy' | 'setCreatedByRef'>> {
  readonly user: EndUserEntityReference;
  readonly createdBy: EndUserEntityReference;
}

export class MemberAccount extends DomainSeedwork.DomainEntity<MemberAccountProps> implements MemberAccountEntityReference {
  //#region Fields
  private readonly visa: CommunityVisa;
  private readonly context: DomainExecutionContext;
  //#endregion Fields

  //#region Constructors
  constructor(props: MemberAccountProps, context: DomainExecutionContext, visa: CommunityVisa) {
    super(props);
    this.context = context;
    this.visa = visa;
  }
  //#endregion Constructors

  //#region Methods
  private validateVisa() {
    if (
      !this.visa.determineIf(
        (permissions) => permissions.isSystemAccount || permissions.canManageMembers || (permissions.canEditOwnMemberAccounts && permissions.isEditingOwnMemberAccount)
      )
    ) {
      throw new Error('You do not have permission to update this account');
    }
  }
  //#endregion Methods

  //#region Properties
  get firstName(): string {
    return this.props.firstName;
  }
  set firstName(firstName: string) {
    this.validateVisa();
    this.props.firstName = new ValueObjects.FirstName(firstName).valueOf();
  }

  get lastName(): string {
    return this.props.lastName;
  }
  set lastName(lastName: string) {
    this.validateVisa();
    this.props.lastName = new ValueObjects.LastName(lastName).valueOf();
  }

  get user(): EndUserEntityReference {
    return new EndUser(this.props.user, this.context);
  }
  set user(user: EndUserProps) {
    this.validateVisa();
    this.props.setUserRef(user);
  }

  get statusCode(): string {
    return this.props.statusCode;
  }
  set statusCode(statusCode: string) {
    if (!this.visa.determineIf((permissions) => permissions.isSystemAccount || permissions.canManageMembers)) {
      throw new Error('You do not have permission to update this account');
    }
    this.props.statusCode = new ValueObjects.AccountStatusCode(statusCode).valueOf();
  }

  get createdBy(): EndUserEntityReference {
    return new EndUser(this.props.createdBy, this.context);
  }
  set createdBy(createdBy: EndUserProps) {
    this.validateVisa();
    this.props.setCreatedByRef(createdBy);
  }
  // #endregion Properties


}
