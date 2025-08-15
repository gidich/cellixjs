/**
 * This file is used to traverse  all the files in this directory
 * and merge them together to create the application schema
 */
import path from 'node:path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
// import type { Resolvers } from './generated.ts';

console.log(`custom-log | resolver-builder | ${path.join(__dirname, "../../../http-graphql/**/*.resolvers.*")}`);
const resolversArray = loadFilesSync(path.join(__dirname, "../../../http-graphql/**/*.resolvers.*"));
const permissionsArray = loadFilesSync(path.join(__dirname, "../../../http-graphql/**/*.permissions.*"));

export const resolvers = mergeResolvers(resolversArray);
export const permissions = mergeResolvers(permissionsArray);