import { DomainSeedwork } from '@cellix/domain-seedwork';
import { Email } from './vendor-user.value-objects.ts';

export interface VendorUserContactInformationProps extends DomainSeedwork.ValueObjectProps {
  email: string;
}

export interface VendorUserContactInformationEntityReference extends Readonly<VendorUserContactInformationProps> {}

export class VendorUserContactInformation extends DomainSeedwork.ValueObject<VendorUserContactInformationProps> implements VendorUserContactInformationEntityReference {
  // [NN] [ESLINT] temporarily disabled ESLint rule for useless constructor
  // biome-ignore lint:noUselessConstructor
  constructor(props: VendorUserContactInformationProps) {
    super(props);
  }

  get email(): string {
    return this.props.email;
  }
  set email(email: string) {
    this.props.email = (new Email(email)).valueOf() as string;
  }
}