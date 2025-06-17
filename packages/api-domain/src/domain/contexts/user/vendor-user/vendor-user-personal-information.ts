import { DomainSeedwork } from '@cellix/domain-seedwork';
import { VendorUserContactInformation, type VendorUserContactInformationEntityReference, type VendorUserContactInformationProps } from "./vendor-user-contact-information.ts";
import { VendorUserIdentityDetails, type VendorUserIdentityDetailsEntityReference, type VendorUserIdentityDetailsProps } from "./vendor-user-identity-details.ts";

export interface VendorUserPersonalInformationProps extends DomainSeedwork.ValueObjectProps {
  readonly identityDetails: VendorUserIdentityDetailsProps;
  readonly contactInformation: VendorUserContactInformationProps;
}

export interface VendorUserPersonalInformationEntityReference extends Readonly<Omit<VendorUserPersonalInformationProps, 'identityDetails' | 'contactInformation' >> {
  readonly identityDetails: VendorUserIdentityDetailsEntityReference;
  readonly contactInformation: VendorUserContactInformationEntityReference;
}

export class VendorUserPersonalInformation extends DomainSeedwork.ValueObject<VendorUserPersonalInformationProps> implements VendorUserPersonalInformationEntityReference{
  // [NN] [ESLINT] temporarily disabled ESLint rule for useless constructor
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: VendorUserPersonalInformationProps) {
    super(props);
  }

  get identityDetails() {
    return new VendorUserIdentityDetails(this.props.identityDetails);
  }

  get contactInformation() {
    return new VendorUserContactInformation(this.props.contactInformation);
  }
}