import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
import { Domain } from 'api-domain';
import { Models } from 'api-data-sources-mongoose-models';
type CommunityModelType = ReturnType<typeof Models.Community.CommunityModelFactory> & Models.Community.Community;
export declare class CommunityRepository<PropType extends Domain.Contexts.Community.Community.CommunityProps> extends MongooseSeedwork.MongoRepositoryBase<CommunityModelType, PropType, Domain.Contexts.Community.Community.Community<PropType>, Domain.DomainExecutionContext> implements Domain.Contexts.Community.Community.CommunityRepository<PropType> {
    getByIdWithCreatedBy(id: string): Promise<Domain.Contexts.Community.Community.Community<PropType>>;
    getNewInstance(name: string, user: Domain.Contexts.User.EndUser.EndUserEntityReference): Promise<Domain.Contexts.Community.Community.Community<PropType>>;
}
export {};
