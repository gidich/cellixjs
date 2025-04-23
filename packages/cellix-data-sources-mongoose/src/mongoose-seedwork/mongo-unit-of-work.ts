import mongoose, { ClientSession, Model } from 'mongoose';
import { MongoRepositoryBase } from './mongo-repository';
import { DomainSeedwork } from 'cellix-domain-seedwork'; 
import { Base } from './base';

export class MongoUnitOfWork<
  MongoType extends Base,
  PropType extends DomainSeedwork.DomainEntityProps,
  DomainType extends DomainSeedwork.AggregateRoot<PropType>,
  ContextType extends DomainSeedwork.BaseDomainExecutionContext,
  RepoType extends MongoRepositoryBase<MongoType, PropType, DomainType, ContextType>,

> extends DomainSeedwork.PersistenceUnitOfWork<ContextType, PropType, DomainType, RepoType>  {
  
  constructor(
    public readonly model: Model<MongoType>,
    private readonly typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>,
    private readonly bus: DomainSeedwork.EventBus,
    private readonly integrationEventBus: DomainSeedwork.EventBus,
    private readonly repoClass:  new (
      model: Model<MongoType>,
      typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>,
      bus: DomainSeedwork.EventBus,
      session: ClientSession,
      context: ContextType
    ) => RepoType
  ) {
    super();
  }
  
  async withTransaction(context: ContextType, func: (repository: RepoType) => Promise<void>): Promise<void> {
    let repoEvents: DomainSeedwork.DomainEvent[] = []; //todo: can we make this an arry of CustomDomainEvents?
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
      await this.integrationEventBus.dispatch(event as any, event['payload']);
    }
  }
}