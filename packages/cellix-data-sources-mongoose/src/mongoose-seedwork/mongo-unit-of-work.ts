import mongoose, { type ClientSession, Model } from 'mongoose';
import { MongoRepositoryBase } from './mongo-repository.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork'; 
import { type Base } from './base.ts';

export class MongoUnitOfWork<
  MongoType extends Base,
  PropType extends DomainSeedwork.DomainEntityProps,
  PassportType,
  DomainType extends DomainSeedwork.AggregateRoot<PropType, PassportType>,
  RepoType extends MongoRepositoryBase<MongoType, PropType, PassportType, DomainType>,

> extends DomainSeedwork.PersistenceUnitOfWork<PassportType, PropType, DomainType, RepoType>  {
  public readonly model: Model<MongoType>;
  public readonly typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, PassportType, DomainType>;
  public readonly bus: DomainSeedwork.EventBus;
  public readonly integrationEventBus: DomainSeedwork.EventBus;
 // protected passport: PassportType;
  public readonly repoClass: new (
    passport: PassportType,
    model: Model<MongoType>,
    typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, PassportType, DomainType>,
    bus: DomainSeedwork.EventBus,
    session: ClientSession
  ) => RepoType;
  
  constructor(
  //  passport: PassportType,
    bus: DomainSeedwork.EventBus,
    integrationEventBus: DomainSeedwork.EventBus,
    model: Model<MongoType>,
    typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, PassportType, DomainType>,
    repoClass:  new (
      passport: PassportType,
      model: Model<MongoType>,
      typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, PassportType, DomainType>,
      bus: DomainSeedwork.EventBus,
      session: ClientSession
    ) => RepoType
  ) {
    super();
  //  this.passport = passport;
    this.model = model;
    this.typeConverter = typeConverter;
    this.bus = bus;
    this.integrationEventBus = integrationEventBus;
    this.repoClass = repoClass;
  }
  
  async withTransaction(passport: PassportType, func: (repository: RepoType) => Promise<void>): Promise<void> {
    let repoEvents: ReadonlyArray<DomainSeedwork.CustomDomainEvent<any>> = []; //todo: can we make this an arry of CustomDomainEvents?
    console.log('withTransaction');

    await mongoose.connection.transaction(async (session: ClientSession) => {
      console.log('transaction');
      let repo = MongoRepositoryBase.create(passport, this.model, this.typeConverter, this.bus, session, this.repoClass);
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