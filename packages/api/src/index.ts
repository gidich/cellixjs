import { MongoDBInstrumentationConfig } from "@opentelemetry/instrumentation-mongodb";
import { ServiceOtel } from 'service-otel';
import { ServiceMongoose } from 'service-mongoose';

import { Cellix } from './cellix';
import type { ApiContextSpec} from 'api-context-spec';
import { graphHandlerCreator} from 'api-graphql';
import { restHandlerCreator } from 'api-rest';
//import { UserType, UserSchema } from 'service-config/mongoose/schemas/user';
import { mongooseContextBuilder, mongooseConnectOptions, MongooseModels } from "./service-config/mongoose";

export interface ApiContextSpec2 {
  domainDataSources: MongooseModels;
}

const cellixInstance = new Cellix<ApiContextSpec>()
  .RegisterService(new ServiceOtel({
    instrumentationOptions: {
      mongoDb: {
        enabled: true,
        enhancedDatabaseReporting: true // adds query parameters to telemetry
      } as MongoDBInstrumentationConfig,
    }
  }))
  .RegisterService(new ServiceMongoose("connection string", mongooseConnectOptions))
  .SetContext((serviceRegistry) => {
    return {
      // dataSources: 
      domainDataSource: mongooseContextBuilder(serviceRegistry.GetService(ServiceMongoose))
    }
  })
  .RegisterAzureFunctionHandler('graphql', { route: 'graphql' },graphHandlerCreator)
  .RegisterAzureFunctionHandler('rest', { route: 'rest' },restHandlerCreator)
  .StartServer();