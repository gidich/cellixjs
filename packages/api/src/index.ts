import { ServiceOtel } from 'service-otel';
import { ServiceMongoose } from 'service-mongoose';

import { Cellix } from './cellix';
import type { ApiContextSpec} from 'api-context-spec';
import { graphHandlerCreator} from 'api-graphql';
import { restHandlerCreator } from 'api-rest';
import * as MongooseConfig   from "./service-config/mongoose";
import * as OtelConfig from './service-config/otel';


Cellix
  .Create<ApiContextSpec>()
  .initializeServices((serviceRegistry) => serviceRegistry
    .registerService(new ServiceOtel(OtelConfig.customOptions))
    .registerService(new ServiceMongoose(MongooseConfig.mongooseConnectionString, MongooseConfig.mongooseConnectOptions))
  )
  .registerAzureFunctionHandler('graphql', { route: 'graphql' },graphHandlerCreator)
  .registerAzureFunctionHandler('rest', { route: 'rest' },restHandlerCreator)
  .setContext((serviceRegistry) => {
    return {
      // dataSources: 
      domainDataSource: MongooseConfig.mongooseContextBuilder(serviceRegistry.getService(ServiceMongoose))
    }
  })
  