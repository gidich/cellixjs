import { DomainSeedwork } from '@cellix/domain-seedwork';
import * as ValueObjects from './vendor-user.value-objects.ts';

export interface VendorUserIdentityDetailsProps extends DomainSeedwork.ValueObjectProps {
  lastName: string;
  legalNameConsistsOfOneName: boolean;
  restOfName: string| undefined;
}

export interface VendorUserIdentityDetailsEntityReference extends Readonly<VendorUserIdentityDetailsProps> {}

export class VendorUserIdentityDetails extends DomainSeedwork.ValueObject<VendorUserIdentityDetailsProps> implements VendorUserIdentityDetailsEntityReference {
  // [NN] [ESLINT] temporarily disabled ESLint rule for useless constructor
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: VendorUserIdentityDetailsProps) {
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
    this.props.restOfName = restOfName ? new ValueObjects.RestOfName(restOfName).valueOf() : undefined;
  }
}