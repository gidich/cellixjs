import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface EndUserIdentityDetailsProps extends DomainSeedwork.ValueObjectProps {
    lastName: string;
    legalNameConsistsOfOneName: boolean;
    restOfName?: string;
}
export interface EndUserIdentityDetailsEntityReference extends Readonly<EndUserIdentityDetailsProps> {
}
export declare class EndUserIdentityDetails extends DomainSeedwork.ValueObject<EndUserIdentityDetailsProps> implements EndUserIdentityDetailsEntityReference {
    constructor(props: EndUserIdentityDetailsProps);
    get lastName(): string;
    get legalNameConsistsOfOneName(): boolean;
    get restOfName(): string | undefined;
    set LastName(lastName: string);
    set LegalNameConsistsOfOneName(legalNameConsistsOfOneName: boolean);
    set RestOfName(restOfName: string | undefined);
}
