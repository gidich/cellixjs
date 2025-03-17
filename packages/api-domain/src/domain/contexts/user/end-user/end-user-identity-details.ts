import { DomainSeedwork } from 'api-data-sources-seedwork';
import * as ValueObjects from './end-user.value-objects';

export interface EndUserIdentityDetailsProps extends DomainSeedwork.ValueObjectProps {
  lastName: string;
  legalNameConsistsOfOneName: boolean;
  restOfName?: string;
}

export interface EndUserIdentityDetailsEntityReference extends Readonly<EndUserIdentityDetailsProps> {}

export class EndUserIdentityDetails extends DomainSeedwork.ValueObject<EndUserIdentityDetailsProps> implements EndUserIdentityDetailsEntityReference {
  constructor(props: EndUserIdentityDetailsProps) {
    super(props);
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get legalNameConsistsOfOneName(): boolean {
    return this.props.legalNameConsistsOfOneName;
  }

  get restOfName(): string | undefined {
    return this.props.restOfName;
  }

  set LastName(lastName: string) {
    this.props.lastName = (new ValueObjects.LastName(lastName).valueOf());
  }

  set LegalNameConsistsOfOneName(legalNameConsistsOfOneName: boolean) {
    this.props.legalNameConsistsOfOneName = legalNameConsistsOfOneName;
  }

  set RestOfName(restOfName: string | undefined) {
    this.props.restOfName = (new ValueObjects.FirstName(restOfName).valueOf());
  }
}