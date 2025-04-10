import mongoose, { ConnectOptions } from "mongoose";
import type { ServiceBase } from "api-services-spec";
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export declare class ServiceMongoose implements ServiceBase<MongooseSeedwork.MongooseContextFactory>, MongooseSeedwork.MongooseContextFactory {
    private readonly uri;
    private readonly options;
    private readonly schemas;
    private _service;
    constructor(uri: string, options?: ConnectOptions);
    StartUp(): Promise<this>;
    ShutDown(): Promise<void>;
    get service(): typeof mongoose;
}
