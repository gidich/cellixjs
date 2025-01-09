import { ApolloServer } from '@apollo/server';
import { v4 } from '@as-integrations/azure-functions';
import { HttpHandler  } from "@azure/functions-v4";
import type { ApiContextSpec } from 'api-context-spec';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: (res,req,context) => 'world' +  JSON.stringify(context.apiContext),
  },
};

interface GraphContext {
  apiContext: ApiContextSpec;
}

// Set up Apollo Server
const server = new ApolloServer<GraphContext>({   typeDefs,
  resolvers
});

export const graphHandlerCreator = (apiContext: ApiContextSpec):HttpHandler => {
  return v4.startServerAndCreateHandler(server,{
    context: async ({ context, req }) =>{
      return {
        apiContext: apiContext
      }
    }
  });
}