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

interface GraphContext {
  apiContext: ApiContextSpec;
}

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: (_res:any,_req:any,context:GraphContext) => 'world' +  JSON.stringify(context.apiContext),
  },
};


export const graphHandlerCreator = (apiContext: ApiContextSpec):HttpHandler => {
  // Set up Apollo Server
  const server = new ApolloServer<GraphContext>({   typeDefs,
    resolvers
  });

  return v4.startServerAndCreateHandler(server,{
    context: async ({ _context, _req }) =>{
      return {
        apiContext: apiContext
      }
    }
  });
}