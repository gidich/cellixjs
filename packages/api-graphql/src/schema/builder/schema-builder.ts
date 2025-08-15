// /**
//  * This file merges all the schemas together to create 
//  * the overall Apollo schema
//  */

// import { JsonFileLoader } from '@graphql-tools/json-file-loader';
// import { loadSchemaSync } from '@graphql-tools/load';
// import { addResolversToSchema, makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
// import * as Scalars from 'graphql-scalars';
// import type { GraphContext } from '../../init/context.ts';
// import { resolvers } from './resolver-builder.ts';



// const schema = loadSchemaSync('./src/functions/http-graphql/schema/builder/graphql.schema.json', {
//   loaders: [new JsonFileLoader()],
// });

// const appSchema = addResolversToSchema(schema, resolvers)

// const scalarSchema = makeExecutableSchema<GraphContext>({
//   typeDefs:[
//     ...Scalars.typeDefs,
//   ],
//   resolvers:{
//     ...Scalars.resolvers,
//   }
// });

// export const combinedSchema = mergeSchemas({
//   schemas: [
//     appSchema,
//     scalarSchema,
//   ]
// });