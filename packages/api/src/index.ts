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
  .InitializeServices((serviceRegistry) => serviceRegistry
    .RegisterService(new ServiceOtel(OtelConfig.customOptions))
    .RegisterService(new ServiceMongoose(MongooseConfig.mongooseConnectionString, MongooseConfig.mongooseConnectOptions))
  )
  .RegisterAzureFunctionHandler('graphql', { route: 'graphql' },graphHandlerCreator)
  .RegisterAzureFunctionHandler('rest', { route: 'rest' },restHandlerCreator)
  .SetContext((serviceRegistry) => {
    return {
      // dataSources: 
      domainDataSource: MongooseConfig.mongooseContextBuilder(serviceRegistry.GetService(ServiceMongoose))
    }
  })
  