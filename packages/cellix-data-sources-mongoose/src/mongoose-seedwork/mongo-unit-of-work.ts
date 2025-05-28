import mongoose, { type ClientSession, Model } from 'mongoose';
import { MongoRepositoryBase } from './mongo-repository.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork'; 
import { type Base } from './base.ts';

export class MongoUnitOfWork<
  MongoType extends Base,
  PropType extends DomainSeedwork.DomainEntityProps,
  DomainType extends DomainSeedwork.AggregateRoot<PropType>,
  ContextType extends DomainSeedwork.BaseDomainExecutionContext,
  RepoType extends MongoRepositoryBase<MongoType, PropType, DomainType, ContextType>,

> extends DomainSeedwork.PersistenceUnitOfWork<ContextType, PropType, DomainType, RepoType>  {
  public readonly model: Model<MongoType>;
  public readonly typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>;
  public readonly bus: DomainSeedwork.EventBus;
  public readonly integrationEventBus: DomainSeedwork.EventBus;
  public readonly repoClass: new (
    model: Model<MongoType>,
    typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>,
    bus: DomainSeedwork.EventBus,
    session: ClientSession,
    context: ContextType
  ) => RepoType;
  
  constructor(
    model: Model<MongoType>,
    typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>,
    bus: DomainSeedwork.EventBus,
    integrationEventBus: DomainSeedwork.EventBus,
    repoClass:  new (
      model: Model<MongoType>,
      typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>,
      bus: DomainSeedwork.EventBus,
      session: ClientSession,
      context: ContextType
    ) => RepoType
  ) {
    super();
    this.model = model;
    this.typeConverter = typeConverter;
    this.bus = bus;
    this.integrationEventBus = integrationEventBus;
    this.repoClass = repoClass;
  }
  
  async withTransaction(context: ContextType, func: (repository: RepoType) => Promise<void>): Promise<void> {
    let repoEvents: DomainSeedwork.CustomDomainEvent<any>[] = []; //todo: can we make this an arry of CustomDomainEvents?
    console.log('withTransaction');

    await mongoose.connection.transaction(async (session: ClientSession) => {
      console.log('transaction');
      let repo = MongoRepositoryBase.create(this.model, this.typeConverter, this.bus, session, context, this.repoClass);
      console.log('repo created');
      try {
        await func(repo);
        // console.log('func done');
      } catch (e) {
        console.log('func failed');
        console.log(e);
        throw e;
      }
      repoEvents = repo.getIntegrationEvents();
    });
    console.log('integration events');
    //Send integration events after transaction is completed
    for await (let event of repoEvents) {
      await this.integrationEventBus.dispatch(event as any, event.payload);
    }
  }
}