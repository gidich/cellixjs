import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface VendorUserIdentityDetailsProps extends DomainSeedwork.ValueObjectProps {
    lastName: string;
    legalNameConsistsOfOneName: boolean;
    restOfName?: string;
}
export interface VendorUserIdentityDetailsEntityReference extends Readonly<VendorUserIdentityDetailsProps> {
}
export declare class VendorUserIdentityDetails extends DomainSeedwork.ValueObject<VendorUserIdentityDetailsProps> implements VendorUserIdentityDetailsEntityReference {
    constructor(props: VendorUserIdentityDetailsProps);
    get lastName(): string;
    get legalNameConsistsOfOneName(): boolean;
    get restOfName(): string | undefined;
    set LastName(lastName: string);
    set LegalNameConsistsOfOneName(legalNameConsistsOfOneName: boolean);
    set RestOfName(restOfName: string | undefined);
}
