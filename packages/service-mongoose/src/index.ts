import mongoose, { Mongoose, type ConnectOptions } from 'mongoose';
import type { ServiceBase } from 'api-services-spec';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';



export class ServiceMongoose implements ServiceBase<MongooseSeedwork.MongooseContextFactory>, MongooseSeedwork.MongooseContextFactory {
  private readonly uri: string;
  private readonly options: ConnectOptions;
  private serviceInternal: Mongoose | undefined;
  constructor(uri: string, options?: ConnectOptions) {
    if(!uri && uri !== '') { 
      throw new Error('MongoDB uri is required');
    }
    this.uri = uri;
    this.options = options ?? {}; 
  }
  public async startUp()  {
    this.serviceInternal = await mongoose.connect(this.uri, this.options);
    return this
  }
  public async shutDown() {
    if(!this.serviceInternal) {
      throw new Error('ServiceMongoose is not started');
    }
    await this.serviceInternal.disconnect();
    console.log('ServiceMongoose stopped');
  }
  public get service() : Mongoose {
    if(!this.serviceInternal) {
      throw new Error('ServiceMongoose is not started');
    }
    return this.serviceInternal;
  }
}
