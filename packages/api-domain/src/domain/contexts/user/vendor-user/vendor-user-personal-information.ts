import { DomainSeedwork } from 'api-data-sources-seedwork';
import { VendorUserContactInformation, VendorUserContactInformationEntityReference, VendorUserContactInformationProps } from "./vendor-user-contact-information";
import { VendorUserIdentityDetails, VendorUserIdentityDetailsEntityReference, VendorUserIdentityDetailsProps } from "./vendor-user-identity-details";

export interface VendorUserPersonalInformationProps extends DomainSeedwork.ValueObjectProps {
  readonly identityDetails: VendorUserIdentityDetailsProps;
  readonly contactInformation: VendorUserContactInformationProps;
}

export interface VendorUserPersonalInformationEntityReference extends Readonly<Omit<VendorUserPersonalInformationProps, 'identityDetails' | 'contactInformation' >> {
  readonly identityDetails: VendorUserIdentityDetailsEntityReference;
  readonly contactInformation: VendorUserContactInformationEntityReference;
}

export class VendorUserPersonalInformation extends DomainSeedwork.ValueObject<VendorUserPersonalInformationProps> implements VendorUserPersonalInformationEntityReference{
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