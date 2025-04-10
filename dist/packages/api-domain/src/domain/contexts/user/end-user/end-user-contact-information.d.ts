import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface EndUserContactInformationProps extends DomainSeedwork.ValueObjectProps {
    email: string;
}
export interface EndUserContactInformationEntityReference extends Readonly<EndUserContactInformationProps> {
}
export declare class EndUserContactInformation extends DomainSeedwork.ValueObject<EndUserContactInformationProps> implements EndUserContactInformationEntityReference {
    constructor(props: EndUserContactInformationProps);
    get email(): string;
    set Email(email: string);
}
