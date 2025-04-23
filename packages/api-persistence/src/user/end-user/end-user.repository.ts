import { MongooseSeedwork } from '../../../../cellix-data-sources-mongoose/dist/src';
import { Domain } from 'api-domain';
import { Models } from 'api-data-sources-mongoose-models';


export class EndUserRepository<
  PropType extends Domain.Contexts.User.EndUser.EndUserProps
  >
  extends MongooseSeedwork.MongoRepositoryBase<
    Models.User.EndUser, 
    PropType, 
    Domain.Contexts.User.EndUser.EndUser<PropType>,
    Domain.DomainExecutionContext
  >
  implements  Domain.Contexts.User.EndUser.EndUserRepository<PropType>
{
  async getByExternalId(externalId: string): Promise<Domain.Contexts.User.EndUser.EndUser<PropType>> {
    let user = await this.model.findOne({ externalId: externalId }).exec();
    return this.typeConverter.toDomain(user,  this.context);
  }

  async getNewInstance(externalId: string, lastName: string, restOfName?: string): Promise<Domain.Contexts.User.EndUser.EndUser<PropType>> {
    let adapter = this.typeConverter.toAdapter(new this.model());
    return Domain.Contexts.User.EndUser.EndUser.getNewUser(adapter, externalId, lastName, restOfName, this.context); //no context needed for new user
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}
