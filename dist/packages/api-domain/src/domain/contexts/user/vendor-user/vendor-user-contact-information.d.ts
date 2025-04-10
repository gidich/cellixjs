import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface VendorUserContactInformationProps extends DomainSeedwork.ValueObjectProps {
    email: string;
}
export interface VendorUserContactInformationEntityReference extends Readonly<VendorUserContactInformationProps> {
}
export declare class VendorUserContactInformation extends DomainSeedwork.ValueObject<VendorUserContactInformationProps> implements VendorUserContactInformationEntityReference {
    constructor(props: VendorUserContactInformationProps);
    get email(): string;
    set Email(email: string);
}
