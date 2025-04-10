import { Domain } from 'api-domain';
import { Models } from 'api-data-sources-mongoose-models';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export declare class EndUserConverter extends MongooseSeedwork.MongoTypeConverter<Models.User.EndUser, EndUserDomainAdapter, Domain.Contexts.User.EndUser.EndUser<EndUserDomainAdapter>, Domain.DomainExecutionContext> {
    constructor();
}
export declare class EndUserDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<Models.User.EndUser> implements Domain.Contexts.User.EndUser.EndUserProps {
    get externalId(): string;
    set externalId(externalId: string);
    get personalInformation(): EndUserPersonalInformationDomainAdapter;
    get email(): string;
    set email(email: string);
    get displayName(): string;
    set displayName(displayName: string);
    get accessBlocked(): boolean;
    set accessBlocked(accessBlocked: boolean);
    get tags(): string[];
    set tags(tags: string[]);
}
export declare class EndUserPersonalInformationDomainAdapter implements Domain.Contexts.User.EndUser.EndUserPersonalInformationProps {
    readonly props: Models.User.EndUserPersonalInformation;
    constructor(props: Models.User.EndUserPersonalInformation);
    get identityDetails(): EndUserIdentityDetailsDomainAdapter;
    get contactInformation(): EndUserContactInformationDomainAdapter;
}
export declare class EndUserIdentityDetailsDomainAdapter implements Domain.Contexts.User.EndUser.EndUserIdentityDetailsProps {
    readonly props: Models.User.EndUserIdentityDetails;
    constructor(props: Models.User.EndUserIdentityDetails);
    get lastName(): string;
    set lastName(lastName: string);
    get legalNameConsistsOfOneName(): boolean;
    set legalNameConsistsOfOneName(legalNameConsistsOfOneName: boolean);
    get restOfName(): string;
    set restOfName(restOfName: string);
}
export declare class EndUserContactInformationDomainAdapter implements Domain.Contexts.User.EndUser.EndUserContactInformationProps {
    readonly props: Models.User.EndUserContactInformation;
    constructor(props: Models.User.EndUserContactInformation);
    get email(): string;
    set email(email: string);
}
