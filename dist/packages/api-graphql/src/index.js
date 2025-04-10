"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphHandlerCreator = void 0;
const server_1 = require("@apollo/server");
const azure_functions_1 = require("@as-integrations/azure-functions");
// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;
// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        hello: (res, req, context) => 'world' + JSON.stringify(context.apiContext),
    },
};
const graphHandlerCreator = (apiContext) => {
    // Set up Apollo Server
    const server = new server_1.ApolloServer({ typeDefs,
        resolvers
    });
    return azure_functions_1.v4.startServerAndCreateHandler(server, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ context, req }) {
            return {
                apiContext: apiContext
            };
        })
    });
};
exports.graphHandlerCreator = graphHandlerCreator;
//# sourceMappingURL=index.js.map