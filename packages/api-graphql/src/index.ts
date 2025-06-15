import { ApolloServer, type BaseContext } from '@apollo/server';
import { startServerAndCreateHandler, type AzureFunctionsMiddlewareOptions } from './azure-functions.ts';
import { type HttpHandler  } from "@azure/functions-v4";
import type { ApiContextSpec } from '@ocom/api-context-spec';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }

  type Mutation {
    sendMessageToOutboundExampleQueue(input: OutboundExampleMessageInput!): MutationStatus!
  }

  input OutboundExampleMessageInput {
    requiredField: String!
    optionalField: String
  }

  type MutationStatus {
    success: Boolean!
    errorMessage: String
  }
`;

interface GraphContext extends BaseContext {
  apiContext?: ApiContextSpec;
}

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: (_parent:any,_args:any,context:GraphContext) => 'world' +  JSON.stringify(context.apiContext?.domainDataSource),
  },
  Mutation: {
    sendMessageToOutboundExampleQueue: async (_parent:unknown, args: { input: { requiredField: string, optionalField?: string } }, context:GraphContext) => {
      try {
        const { input } = args;
        await context.apiContext?.queueSender.sendMessageToOutboundExampleQueue({
          requiredField: input.requiredField,
          optionalField: input.optionalField
        })
        return {
          success: true,
          errorMessage: null
        };
      } catch (error) {
        console.error('Error sending message to queue:', error);
        return {
          success: false,
          errorMessage: `Failed to send message to queue: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
        };
      }
    }
  }
};


export const graphHandlerCreator = (apiContext: ApiContextSpec):HttpHandler => {
  // Set up Apollo Server
  const server = new ApolloServer<GraphContext>({
    typeDefs,
    resolvers
  });
  const functionOptions : AzureFunctionsMiddlewareOptions<GraphContext> = {
    context: async () => {
      return {
        apiContext: apiContext
      }
    }
  }
  return startServerAndCreateHandler(server,functionOptions);
}