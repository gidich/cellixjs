import mongoose, {Model, DefaultSchemaOptions, ObtainDocumentType, ResolveSchemaOptions, Schema, SchemaDefinition, SchemaDefinitionType, SchemaOptions, FlatRecord} from "mongoose";
import { Base } from "./base";

export type SchemaConstructor<ModelType extends Base> = ObtainDocumentType<any, ModelType, ResolveSchemaOptions<DefaultSchemaOptions>> | SchemaDefinition<SchemaDefinitionType<ModelType>, ModelType>;
export type GetModelFunction = <ModelType extends Base>(modelName: string, schemaConstructor: SchemaConstructor<ModelType>) => Model<ModelType>;
export type GetModelFunctionWithSchema = <ModelType extends Base>(modelName: string, schema: Schema<ModelType,Model<ModelType>,ModelType>) => Model<ModelType>;
export {type Schema} from 'mongoose';

export interface MongooseContextFactory {
//  GetModel: GetModelFunctionWithSchema;

  readonly service: mongoose.Mongoose;
}

export function modelFactory<ModelType extends Base> (modelName: string, schema:Schema<ModelType,Model<ModelType>,ModelType>) : (initializedService:MongooseContextFactory) => Model<ModelType> {
  return (initializedService: MongooseContextFactory) => {
    //return initializedService.GetModel(modelName, schema);
    return initializedService.service.model<ModelType>(modelName, schema);
    //return mongoose.model<ModelType>(modelName, schema);
  };
}

