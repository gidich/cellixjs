import { ApolloServer } from '@apollo/server';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApplicationServicesFactory, PrincipalHints } from '@ocom/api-application-services';
import type { Domain } from '@ocom/api-domain';
import type { GraphQLResolveInfo } from 'graphql';
import { getRequestedFieldPaths } from '../schema/resolver-helper.ts';
import {
	type AzureFunctionsMiddlewareOptions,
    startServerAndCreateHandler,
    type WithRequired
} from './azure-functions.ts';
import type { GraphContext } from './context.ts';

const typeDefs = `#graphql
  type Community {
    id: String
    name: String
    createdBy: EndUser
  }

  type EndUserContactInformation {
    email: String
  }

  type EndUserPersonalInformation {
    contactInformation: EndUserContactInformation
  }

  type EndUser {
    id: String
    displayName: String
    personalInformation: EndUserPersonalInformation
  }

  type Query {
    hello: String
    endUserById(id: String!): EndUser
    endUsersByName(displayName: String!): [EndUser]
  }

  input CommunityCreateInput {
    name: String!
    createdByEndUserId: String!
  }

  type Mutation {
    communityCreate(input: CommunityCreateInput!): Community
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
    Community: {
        createdBy: async (parent: Domain.Contexts.Community.Community.CommunityEntityReference, _args: unknown, _context: GraphContext) => {
            return await parent.loadCreatedBy();
        },
    },
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) => {
			return `world${JSON.stringify(context)}`;
        },
        endUserById: async (_parent: unknown, args: { id: string }, context: GraphContext, info: GraphQLResolveInfo) => {
            return await context.applicationServices.User.EndUser.queryById({
               id: args.id,
               fields: getRequestedFieldPaths(info)
            });
        },
        endUsersByName: async (_parent: unknown, args: { displayName: string }, context: GraphContext, info: GraphQLResolveInfo) => {
            return await context.applicationServices.User.EndUser.queryByName({
                displayName: args.displayName,
                fields: getRequestedFieldPaths(info)
            })
        }
	},
    Mutation: {
        communityCreate: async (_parent: unknown, args: { input: { name: string, createdByEndUserId: string } }, context: GraphContext) => {
			return await context.applicationServices.Community.Community.create({
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