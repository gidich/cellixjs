import { MongoDBInstrumentationConfig } from "@opentelemetry/instrumentation-mongodb";
import { ServiceOtel } from 'service-otel';
import { ServiceMongoose } from 'service-mongoose';

import { Cellix } from './cellix';
import type { ApiContextSpec} from 'api-context-spec';
import { graphHandlerCreator} from 'api-graphql';
import { restHandlerCreator } from 'api-rest';

const cellixInstance = new Cellix<ApiContextSpec>()
    .RegisterService(new ServiceOtel({
        instrumentationOptions: {
            mongoDb: {
                enabled: true,
                enhancedDatabaseReporting: true // adds query parameters to telemetry
            } as MongoDBInstrumentationConfig,
        }
    }))
    .RegisterService(new ServiceMongoose("", {}))
    .SetContext((serviceRegistry) => {
        return {
            mongooseService: serviceRegistry.GetService(ServiceMongoose)
        } as ApiContextSpec;
    })
    .RegisterAzureFunctionHandler('graphql', { route: 'graphql' },graphHandlerCreator)
    .RegisterAzureFunctionHandler('rest', { route: 'rest' },restHandlerCreator)
    .StartServer();