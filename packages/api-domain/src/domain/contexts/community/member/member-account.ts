import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { CommunityVisa } from "../community.visa";
import { EndUser, EndUserEntityReference, EndUserProps } from '../../user/end-user/end-user';
import * as ValueObjects from './member-account.value-objects';

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
  constructor(props: MemberAccountProps, private readonly context: DomainExecutionContext, private readonly visa: CommunityVisa) {
    super(props);
  }

  get firstName(): string {
    return this.props.firstName;
  }
  get lastName(): string {
    return this.props.lastName;
  }
  get user(): EndUserEntityReference {
    return new EndUser(this.props.user, this.context);
  }
  get statusCode(): string {
    return this.props.statusCode;
  }
  get createdBy(): EndUserEntityReference {
    return new EndUser(this.props.createdBy, this.context);
  }

  private validateVisa() {
    if (
      !this.visa.determineIf(
        (permissions) => permissions.isSystemAccount || permissions.canManageMembers || (permissions.canEditOwnMemberAccounts && permissions.isEditingOwnMemberAccount)
      )
    ) {
      throw new Error('You do not have permission to update this account');
    }
  }

  // using ts 5.1 setters
  set FirstName(firstName: string) {
    this.validateVisa();
    this.props.firstName = new ValueObjects.FirstName(firstName).valueOf();
  }

  set LastName(lastName: string) {
    this.validateVisa();
    this.props.lastName = new ValueObjects.LastName(lastName).valueOf();
  }

  set User(user: EndUserProps) {
    this.validateVisa();
    this.props.setUserRef(user);
  }

  set StatusCode(statusCode: string) {
    if (!this.visa.determineIf((permissions) => permissions.isSystemAccount || permissions.canManageMembers)) {
      throw new Error('You do not have permission to update this account');
    }
    this.props.statusCode = new ValueObjects.AccountStatusCode(statusCode).valueOf();
  }

  set CreatedBy(createdBy: EndUserProps) {
    this.validateVisa();
    this.props.setCreatedByRef(createdBy);
  }
}
