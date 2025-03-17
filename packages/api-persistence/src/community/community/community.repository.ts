import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
import { Domain } from 'api-domain';
import { Models } from 'api-data-sources-mongoose-models';

type CommunityModelType = ReturnType<typeof Models.Community.CommunityModelFactory> & Models.Community.Community;

export class CommunityRepository<
  PropType extends Domain.Contexts.Community.Community.CommunityProps
  >
  extends MongooseSeedwork.MongoRepositoryBase<
    CommunityModelType, 
    PropType, 
    Domain.Contexts.Community.Community.Community<PropType>,
    Domain.DomainExecutionContext
    >
  implements Domain.Contexts.Community.Community.CommunityRepository<PropType>
{

  async getByIdWithCreatedBy(id: string): Promise<Domain.Contexts.Community.Community.Community<PropType>> {
    const mongoCommunity = await this.model.findById(id).populate('createdBy').exec();
    return this.typeConverter.toDomain(mongoCommunity,this.context);
  }

  async getNewInstance(name: string, user: Domain.Contexts.User.EndUser.EndUserEntityReference): Promise<Domain.Contexts.Community.Community.Community<PropType>> {
    let adapter = this.typeConverter.toAdapter(new this.model());
    return Domain.Contexts.Community.Community.Community.getNewInstance(adapter, name, user, this.context);
  }

}
  
