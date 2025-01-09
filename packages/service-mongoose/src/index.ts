import mongoose, {ConnectOptions} from "mongoose";

import type { ServiceBase } from "api-services-spec";

export class ServiceMongoose implements ServiceBase {
  private readonly uri: string;
  private readonly options: ConnectOptions;
  constructor(uri: string, options?: ConnectOptions) {
    this.uri = uri;
    this.options = options; 
  }
  public async StartUp() {
    console.log('ServiceMongoose starting');
    if(!this.uri && this.uri !== '') { 
    mongoose.connect(this.uri, this.options);
    }
    console.log('ServiceMongoose started');
  }
  public async ShutDown() {
    mongoose.disconnect();
    console.log('ServiceMongoose stopped');
  }
}