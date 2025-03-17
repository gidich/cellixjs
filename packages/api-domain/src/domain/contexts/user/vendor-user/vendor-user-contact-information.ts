import { DomainSeedwork } from 'api-data-sources-seedwork';

import { Email } from "./vendor-user.value-objects";

export interface VendorUserContactInformationProps extends DomainSeedwork.ValueObjectProps {
  email: string;
}

export interface VendorUserContactInformationEntityReference extends Readonly<VendorUserContactInformationProps> {}

export class VendorUserContactInformation extends DomainSeedwork.ValueObject<VendorUserContactInformationProps> implements VendorUserContactInformationEntityReference {
  constructor(props: VendorUserContactInformationProps) {
    super(props);
  }

  get email(): string {
    return this.props.email;
  }

  set Email(email: string) {
    this.props.email = (new Email(email)).valueOf();
  }
}