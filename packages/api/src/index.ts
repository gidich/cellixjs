import './service-config/otel-starter';

import { Cellix } from './cellix';
import type { ApiContextSpec} from 'api-context-spec';

import { ServiceMongoose } from 'service-mongoose';
import * as MongooseConfig   from "./service-config/mongoose";

import { graphHandlerCreator} from 'api-graphql';
import { restHandlerCreator } from 'api-rest';



 Cellix
  .initializeServices<ApiContextSpec>((serviceRegistry) => serviceRegistry
    .registerService(new ServiceMongoose(MongooseConfig.mongooseConnectionString, MongooseConfig.mongooseConnectOptions))
  )
  .registerAzureFunctionHandler('graphql', { route: 'graphql' },graphHandlerCreator)
  .registerAzureFunctionHandler('rest', { route: 'rest' },restHandlerCreator)
  .setContext((serviceRegistry) => {
    return {
      domainDataSource: MongooseConfig.mongooseContextBuilder(serviceRegistry.getService(ServiceMongoose))
    }
  });
  