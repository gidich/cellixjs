import { DomainSeedwork } from '@cellix/domain-seedwork';
import { Email } from './end-user.value-objects.ts';

export interface EndUserContactInformationProps extends DomainSeedwork.ValueObjectProps {
  email: string;
}

export interface EndUserContactInformationEntityReference extends Readonly<EndUserContactInformationProps> {}

export class EndUserContactInformation extends DomainSeedwork.ValueObject<EndUserContactInformationProps> implements EndUserContactInformationEntityReference {
  constructor(props: EndUserContactInformationProps) {
    super(props);
  }

  get email(): string {
    return this.props.email;
  }
  set Email(email: string) {
    this.props.email = (new Email(email)).valueOf();
  }
}