import { DomainSeedwork } from '@cellix/domain-seedwork';
import { EndUserContactInformation, type EndUserContactInformationEntityReference, type EndUserContactInformationProps } from "./end-user-contact-information.ts";
import { EndUserIdentityDetails, type EndUserIdentityDetailsEntityReference, type EndUserIdentityDetailsProps } from "./end-user-identity-details.ts";

export interface EndUserPersonalInformationProps extends DomainSeedwork.ValueObjectProps {
  readonly identityDetails: EndUserIdentityDetailsProps;
  readonly contactInformation: EndUserContactInformationProps;
}

export interface EndUserPersonalInformationEntityReference extends Readonly<Omit<EndUserPersonalInformationProps, 'identityDetails' | 'contactInformation' >> {
  readonly identityDetails: EndUserIdentityDetailsEntityReference;
  readonly contactInformation: EndUserContactInformationEntityReference;
}

export class EndUserPersonalInformation extends DomainSeedwork.ValueObject<EndUserPersonalInformationProps> implements EndUserPersonalInformationEntityReference{
  constructor(props: EndUserPersonalInformationProps) {
    super(props);
  }

  get identityDetails() {
    return new EndUserIdentityDetails(this.props.identityDetails);
  }

  get contactInformation() {
    return new EndUserContactInformation(this.props.contactInformation);
  }
}