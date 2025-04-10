"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceMongoose = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
class ServiceMongoose {
    constructor(uri, options) {
        this.schemas = new Map();
        if (!uri && uri !== '') {
            throw new Error('MongoDB uri is required');
        }
        this.uri = uri;
        this.options = options;
    }
    StartUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this._service = yield mongoose_1.default.connect(this.uri, this.options);
            return this;
        });
    }
    ShutDown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._service.disconnect();
            console.log('ServiceMongoose stopped');
        });
    }
    get service() {
        return this._service;
    }
}
exports.ServiceMongoose = ServiceMongoose;
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
//# sourceMappingURL=index.js.map