import './service-config/otel-starter.ts';

import { Cellix } from './cellix.ts';
import type { ApiContextSpec } from '@ocom/api-context-spec';
import { type ApplicationServices, buildApplicationServicesFactory } from '@ocom/api-application-services';

import { ServiceMongoose } from '@ocom/service-mongoose';
import * as MongooseConfig from './service-config/mongoose/index.ts';

import { ServiceBlobStorage } from '@ocom/service-blob-storage';

import { ServiceTokenValidation } from '@ocom/service-token-validation';
import * as TokenValidationConfig from './service-config/token-validation/index.ts';

import { graphHandlerCreator } from '@ocom/api-graphql';
import { restHandlerCreator } from '@ocom/api-rest';


Cellix
    .initializeInfrastructureServices<ApiContextSpec, ApplicationServices>((serviceRegistry) => {
        serviceRegistry
            .registerInfrastructureService(
                new ServiceMongoose(
                    MongooseConfig.mongooseConnectionString,
                    MongooseConfig.mongooseConnectOptions,
                ),
            )
            .registerInfrastructureService(new ServiceBlobStorage())
            .registerInfrastructureService(
                new ServiceTokenValidation(
                    TokenValidationConfig.portalTokens,
                ),
            );
    })
	.setContext((serviceRegistry) => {
		return {
			dataSources: MongooseConfig.mongooseContextBuilder(
				serviceRegistry.getInfrastructureService<ServiceMongoose>(ServiceMongoose),
			),
			tokenValidationService: serviceRegistry.getInfrastructureService<ServiceTokenValidation>(ServiceTokenValidation),
		};
	})
    .initializeApplicationServices((context) => buildApplicationServicesFactory(context))
    .registerAzureFunctionHttpHandler(
        'graphql',
        { route: 'graphql' },
        graphHandlerCreator,
    )
    .registerAzureFunctionHttpHandler(
        'rest',
        { route: '{communityId}/{role}/{memberId}/{*rest}' },
        restHandlerCreator,
    )
    .startUp();
