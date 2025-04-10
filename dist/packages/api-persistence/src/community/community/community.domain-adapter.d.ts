import { Domain } from 'api-domain';
import { Models } from 'api-data-sources-mongoose-models';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export declare class CommunityConverter extends MongooseSeedwork.MongoTypeConverter<Models.Community.Community, CommunityDomainAdapter, Domain.Contexts.Community.Community.Community<CommunityDomainAdapter>, Domain.DomainExecutionContext> {
    constructor();
}
export declare class CommunityDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<Models.Community.Community> implements Domain.Contexts.Community.Community.CommunityProps {
    get name(): string;
    set name(name: string);
    get domain(): string;
    set domain(domain: string);
    get whiteLabelDomain(): string;
    set whiteLabelDomain(whiteLabelDomain: string);
    get handle(): string;
    set handle(handle: string);
    get createdBy(): Domain.Contexts.User.EndUser.EndUserProps;
    setCreatedByRef(user: Domain.Contexts.User.EndUser.EndUserEntityReference): void;
}
