import mongoose, {Mongoose,ConnectOptions, DefaultSchemaOptions, ObtainDocumentType, ResolveSchemaOptions, Schema, SchemaDefinition, SchemaDefinitionType} from "mongoose";
import { Base } from "./typeDef";

import type { ServiceBase } from "api-services-spec";
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';

/*
export type SchemaConstructor<ModelType extends Base> = ObtainDocumentType<any, ModelType, ResolveSchemaOptions<DefaultSchemaOptions>> | SchemaDefinition<SchemaDefinitionType<ModelType>, ModelType>;
export type GetModelFunction = <ModelType extends Base>(modelName: string, schemaConstructor: SchemaConstructor<ModelType>) => mongoose.Model<ModelType>;

export interface MongooseContextFactory {
  GetModel: GetModelFunction;
}

*/

/*
export interface MongooseContextFactory {
 // CreateModel: <ModelType extends Base>(modelName: string, schema: mongoose.Schema<ModelType>) => mongoose.Model<ModelType>;
  //another approach to create model with the schema constructor parameters instead of the schema object
  GetModel: <ModelType extends Base>(modelName: string, schemaConstructor:ObtainDocumentType<any, ModelType, ResolveSchemaOptions<DefaultSchemaOptions>> | SchemaDefinition<SchemaDefinitionType<ModelType>, ModelType>) => mongoose.Model<ModelType>;


}
  */


/*
export const createModelFactory = <ModelType extends Base>(modelName: string, schemaDefinition: ObtainDocumentType<any, ModelType, ResolveSchemaOptions<DefaultSchemaOptions>> | SchemaDefinition<SchemaDefinitionType<ModelType>, ModelType>) => {
  return (initializedService: MongooseContextFactory): Model<ModelType> => {
      const schema = new Schema<ModelType>(schemaDefinition);
      return mongoose.model<ModelType>(modelName, schema);
  };
};
*/

export class ServiceMongoose implements ServiceBase<MongooseSeedwork.MongooseContextFactory>, MongooseSeedwork.MongooseContextFactory {
  private readonly uri: string;
  private readonly options: ConnectOptions;
  private readonly schemas: Map<string, mongoose.Schema> = new Map();
  private _service: Mongoose;
  constructor(uri: string, options?: ConnectOptions) {
    if(!uri && uri !== '') { 
      throw new Error('MongoDB uri is required');
    }
    this.uri = uri;
    this.options = options; 
  }
  public async StartUp()  {
    console.log('ServiceMongoose starting');
    this._service = await mongoose.connect(this.uri, this.options);
    console.log('ServiceMongoose started');
    return this
  }
  public async ShutDown() {
    await this._service.disconnect();
    console.log('ServiceMongoose stopped');
  }
  public get service() {
    return this._service;
  }
}
/*
  }
  public GetModel<ModelType extends Base>(modelName: string, schemaConstructor:SchemaConstructor<ModelType>): Model<ModelType> {
    return mongoose.model<ModelType>(modelName, new Schema<ModelType>(schemaConstructor));
  }
  public CreateModel<ModelType extends Base>(modelName: string, schema: mongoose.Schema<ModelType>) {
    return mongoose.model<ModelType>(modelName, schema);
  }
*/


/*
export function modelFactory<ModelType extends Base> (modelName: string, schemaConstructor:SchemaConstructor<ModelType>) : (initializedService:MongooseContextFactory) => Model<ModelType> {
  return (initializedService: MongooseContextFactory) => {
    return initializedService.GetModel(modelName, schemaConstructor);
  };
}
  */