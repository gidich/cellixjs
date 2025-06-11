import { ApolloServer, type BaseContext } from '@apollo/server';
import { startServerAndCreateHandler, type AzureFunctionsMiddlewareOptions } from './azure-functions.ts';
import { type HttpHandler  } from "@azure/functions-v4";
import type { ApiContextSpec } from '@ocom/api-context-spec';
import { type OutboundExamplePayloadType, OutboundQueueNameEnum } from '@ocom/api-queue-storage';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }

  type Mutation {
    sendMessageToOutboundExampleQueue(message: String!): MutationStatus!
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
    sendMessageToOutboundExampleQueue: async (_parent:any, args: { message: string }, context:GraphContext) => {
      const messagePayload: OutboundExamplePayloadType = JSON.parse(args.message);
      try {
        await context.apiContext?.queueSender.sendMessageToQueue<OutboundExamplePayloadType>(OutboundQueueNameEnum.OUTBOUND_EXAMPLE, messagePayload);
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