import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
import type { DomainDataSource } from 'api-domain';
export declare const Persistence: (initializedService: MongooseSeedwork.MongooseContextFactory) => DomainDataSource;
