import { DomainSeedwork } from '@cellix/domain-seedwork';
import * as ValueObjects from './end-user.value-objects.ts';
import type { UserVisa } from '../user.visa.ts';

export interface EndUserIdentityDetailsProps extends DomainSeedwork.ValueObjectProps {
  lastName: string;
  legalNameConsistsOfOneName: boolean;
  restOfName: string | undefined;
}

export interface EndUserIdentityDetailsEntityReference extends Readonly<EndUserIdentityDetailsProps> {}

export class EndUserIdentityDetails extends DomainSeedwork.ValueObject<EndUserIdentityDetailsProps> implements EndUserIdentityDetailsEntityReference {
  private isNew: boolean = false;
  private readonly visa: UserVisa
  constructor(props: EndUserIdentityDetailsProps, visa: UserVisa) {
    super(props);
    this.visa = visa;
  }

  private markAsNew(): void {
    this.isNew = true;
  }

  public static getNewInstance(props: EndUserIdentityDetailsProps, visa: UserVisa, lastName: string, legalNameConsistsOfOneName: boolean, restOfName: string | undefined): EndUserIdentityDetails {
    const newInstance = new EndUserIdentityDetails(props, visa);
    newInstance.markAsNew();
    newInstance.lastName = lastName;
    newInstance.legalNameConsistsOfOneName = legalNameConsistsOfOneName;
    newInstance.restOfName = restOfName;
    newInstance.isNew = false;
    return newInstance;
  }

  private validateVisa(): void {
    if (!this.isNew || !this.visa.determineIf((permissions) => permissions.isEditingOwnAccount || permissions.canManageEndUsers)) {
      throw new DomainSeedwork.PermissionError('Cannot set identity details');
    }
  }

  get lastName(): string {
    return this.props.lastName;
  }
  set lastName(lastName: string) {
    this.validateVisa();
    this.props.lastName = (new ValueObjects.LastName(lastName).valueOf());
  }

  get legalNameConsistsOfOneName(): boolean {
    return this.props.legalNameConsistsOfOneName;
  }
  set legalNameConsistsOfOneName(legalNameConsistsOfOneName: boolean) {
    this.validateVisa();
    this.props.legalNameConsistsOfOneName = legalNameConsistsOfOneName;
  }
  
  get restOfName(): string | undefined {
    return this.props.restOfName;
  }
  set restOfName(restOfName: string | undefined) {
    this.validateVisa();
    this.props.restOfName = restOfName?(new ValueObjects.FirstName(restOfName).valueOf()): undefined;
  }
}