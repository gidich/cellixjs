import { ApolloServer, type BaseContext } from '@apollo/server';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApplicationServices, ApplicationServicesFactory, PrincipalHints } from '@ocom/api-application-services';
import {
	type AzureFunctionsMiddlewareOptions,
    startServerAndCreateHandler,
    type WithRequired
} from './azure-functions.ts';

// The GraphQL schema
const typeDefs = `#graphql
  type Community {
    id: String
    name: String
    createdBy: EndUser
  } 

  type EndUser {
    id: String
    displayName: String
  }

  type Query {
    hello: String
  }

  input CommunityCreateInput {
    name: String!
    createdByEndUserId: String!
  }

  type Mutation {
    communityCreate(input: CommunityCreateInput!): Community
  }
`;

interface GraphContext extends BaseContext {
    applicationServices: ApplicationServices;
}
// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) => {
			return `world${JSON.stringify(context)}`;
        }
	},
    Mutation: {
        communityCreate: async (_parent: unknown, args: { input: { name: string, createdByEndUserId: string } }, context: GraphContext) => {
			return await context.applicationServices.Community.create({
                name: args.input.name,
                createdByEndUserId: args.input.createdByEndUserId
            });
        }
    }
};

export const graphHandlerCreator = (
	applicationServicesFactory: ApplicationServicesFactory,
): HttpHandler => {
	// Set up Apollo Server
	const server = new ApolloServer<GraphContext>({
		typeDefs,
		resolvers,
	});
	const functionOptions: WithRequired<AzureFunctionsMiddlewareOptions<GraphContext>, 'context'> = {
		context: async ({ req }) => {
            const authHeader = req.headers.get('Authorization') ?? undefined;
            const hints: PrincipalHints = {
                memberId: req.headers.get('x-member-id') ?? undefined,
                communityId: req.headers.get('x-community-id') ?? undefined,
            };
            return Promise.resolve({
                applicationServices: await applicationServicesFactory.forRequest(authHeader, hints),
            });
		},
	};
	return startServerAndCreateHandler<GraphContext>(server, functionOptions);
};
