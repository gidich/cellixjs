import './service-config/otel-starter.ts';

import { Cellix } from './cellix.ts';
import type { ApiContextSpec} from '@ocom/api-context-spec';

import { ServiceMongoose } from '@ocom/service-mongoose';
import * as MongooseConfig   from "./service-config/mongoose/index.ts";

import { graphHandlerCreator} from '@ocom/api-graphql';
import { restHandlerCreator } from '@ocom/api-rest';



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
  }
);
  