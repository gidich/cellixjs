import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
import { Domain } from 'api-domain';
import { Models } from 'api-data-sources-mongoose-models';
export declare class EndUserRepository<PropType extends Domain.Contexts.User.EndUser.EndUserProps> extends MongooseSeedwork.MongoRepositoryBase<Models.User.EndUser, PropType, Domain.Contexts.User.EndUser.EndUser<PropType>, Domain.DomainExecutionContext> implements Domain.Contexts.User.EndUser.EndUserRepository<PropType> {
    getByExternalId(externalId: string): Promise<Domain.Contexts.User.EndUser.EndUser<PropType>>;
    getNewInstance(externalId: string, lastName: string, restOfName?: string): Promise<Domain.Contexts.User.EndUser.EndUser<PropType>>;
    delete(id: string): Promise<void>;
}
