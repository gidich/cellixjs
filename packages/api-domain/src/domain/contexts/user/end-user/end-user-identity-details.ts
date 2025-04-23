import { DomainSeedwork } from '@cellix/domain-seedwork';
import * as ValueObjects from './end-user.value-objects.ts';

export interface EndUserIdentityDetailsProps extends DomainSeedwork.ValueObjectProps {
  lastName: string;
  legalNameConsistsOfOneName: boolean;
  restOfName: string | undefined;
}

export interface EndUserIdentityDetailsEntityReference extends Readonly<EndUserIdentityDetailsProps> {}

export class EndUserIdentityDetails extends DomainSeedwork.ValueObject<EndUserIdentityDetailsProps> implements EndUserIdentityDetailsEntityReference {
  constructor(props: EndUserIdentityDetailsProps) {
    super(props);
  }

  get lastName(): string {
    return this.props.lastName;
  }
  set lastName(lastName: string) {
    this.props.lastName = (new ValueObjects.LastName(lastName).valueOf());
  }

  get legalNameConsistsOfOneName(): boolean {
    return this.props.legalNameConsistsOfOneName;
  }
  set legalNameConsistsOfOneName(legalNameConsistsOfOneName: boolean) {
    this.props.legalNameConsistsOfOneName = legalNameConsistsOfOneName;
  }
  
  get restOfName(): string | undefined {
    return this.props.restOfName;
  }
  set restOfName(restOfName: string | undefined) {
    this.props.restOfName = restOfName?(new ValueObjects.FirstName(restOfName).valueOf()): undefined;
  }
}