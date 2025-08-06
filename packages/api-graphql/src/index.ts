import { ApolloServer, type BaseContext } from '@apollo/server';
import {
	startServerAndCreateHandler,
	type AzureFunctionsMiddlewareOptions,
} from './azure-functions.ts';
import type { HttpHandler, HttpRequest } from '@azure/functions-v4';
import type { ApiContextSpec } from '@ocom/api-context-spec';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

interface GraphContext extends BaseContext {
	domainDataSourceFromJwt?: ApiContextSpec['domainDataSourceFromJwt'];
}

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) =>
			`world${JSON.stringify(context)}`,
	},
};

export const graphHandlerCreator = (
	apiContext: ApiContextSpec,
): HttpHandler => {
	// Set up Apollo Server
	const server = new ApolloServer<GraphContext>({
		typeDefs,
		resolvers,
	});
	const functionOptions: AzureFunctionsMiddlewareOptions<GraphContext> = {
		context: () => {
            // use apiContext.tokenValidationService
			return Promise.resolve({
                domainDataSourceFromJwt: apiContext.domainDataSourceFromJwt,
			});
		},
	};
	return startServerAndCreateHandler(server, functionOptions);
};
