import { ApolloServer } from '@apollo/server';
import { v4 } from '@as-integrations/azure-functions';
import { HttpHandler  } from "@azure/functions-v4";
import { StartupObject } from 'api-services-spec';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: (res,req,context) => 'world' +  JSON.stringify(context.startupObject),
  },
};

interface ContextType {
  startupObject: StartupObject;
}

const context = {

}

  // Set up Apollo Server
  const server = new ApolloServer<ContextType>({   typeDefs,
    resolvers
  });
    


//export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;


export const graphHandlerCreator = (startupObject: StartupObject):HttpHandler => {


    return v4.startServerAndCreateHandler(server,{
      context: async ({ context, req }) =>{
        return {
          startupObject: startupObject
        }
      }
    });
    //return handler(request, context);
  
}