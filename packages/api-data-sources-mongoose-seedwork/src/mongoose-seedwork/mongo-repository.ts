import { ClientSession, Model } from 'mongoose';
import { DomainSeedwork } from 'api-data-sources-seedwork'; 
import { Base } from './base';

export abstract class MongoRepositoryBase<
  MongoType extends Base, 
  PropType extends DomainSeedwork.DomainEntityProps, 
  DomainType extends DomainSeedwork.AggregateRoot<PropType>,
  ContextType extends DomainSeedwork.BaseDomainExecutionContext
  >
  implements DomainSeedwork.Repository<DomainType>
{
  protected itemsInTransaction: DomainType[] = [];
  public constructor(
    protected model: Model<MongoType>,
    public typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>,
    protected eventBus: DomainSeedwork.EventBus,
    protected session: ClientSession,
    protected context: ContextType
  ) {}

  async get(id: string): Promise<DomainType> {
    return this.typeConverter.toDomain(await this.model.findById(id).exec(), this.context);
  }

  async save(item: DomainType): Promise<DomainType> {
    item.onSave(this.typeConverter.toPersistence(item).isModified());

    console.log('saving item');
    for await (let event of item.getDomainEvents()) {
      console.log(`Repo dispatching DomainEvent : ${JSON.stringify(event)}`);
      await this.eventBus.dispatch(event as any, event['payload']);
    }
    item.clearDomainEvents();
    this.itemsInTransaction.push(item);
    try {
      if (item.isDeleted === true) {
        await this.model.deleteOne({ _id: item.id }, { session: this.session }).exec();
        return item;
      } else {
        console.log('saving item id', item.id);
        const mongoObj = this.typeConverter.toPersistence(item);
        return this.typeConverter.toDomain(await mongoObj.save({ session: this.session }), this.context);
      }
    } catch (error) {
      console.log(`Error saving item : ${error}`);
      throw error;
    }
  }

  getIntegrationEvents(): DomainSeedwork.DomainEvent[] {
    const integrationEventsGroup = this.itemsInTransaction.map((item) => {
      const integrationEvents = item.getIntegrationEvents();
      item.clearIntegrationEvents();
      return integrationEvents;
    });
    return integrationEventsGroup.reduce((acc, curr) => acc.concat(curr), []);
  }

  static create<
    ContextType extends DomainSeedwork.BaseDomainExecutionContext,
    MongoType extends Base,
    PropType extends DomainSeedwork.DomainEntityProps,
    DomainType extends DomainSeedwork.AggregateRoot<PropType>,
    RepoType extends MongoRepositoryBase<MongoType, PropType, DomainType, ContextType>
  >(
    model: Model<MongoType>,
    typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType,  ContextType>,
    bus: DomainSeedwork.EventBus,
    session: ClientSession,
    context: ContextType,
    repoClass: new (
      model: Model<MongoType>, 
      typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>,
      bus: DomainSeedwork.EventBus, 
      session: ClientSession,
      context: ContextType) => RepoType
  ): RepoType {
    return new repoClass(model, typeConverter, bus, session, context);
  }
}
