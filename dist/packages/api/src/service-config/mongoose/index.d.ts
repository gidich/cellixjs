import { type ConnectOptions } from 'mongoose';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export declare const mongooseConnectOptions: ConnectOptions;
export declare const mongooseConnectionString: string;
export declare const mongooseContextBuilder: (initializedService: MongooseSeedwork.MongooseContextFactory) => import("api-domain").DomainDataSource;
export type MongooseModels = ReturnType<typeof mongooseContextBuilder>;
