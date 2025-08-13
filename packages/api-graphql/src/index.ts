import { ApolloServer, type BaseContext } from '@apollo/server';
import type { HttpHandler } from '@azure/functions-v4';
import type { GraphQLResolveInfo, SelectionSetNode, FragmentDefinitionNode } from 'graphql';
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

interface GraphContext extends BaseContext {
    applicationServices: ApplicationServices;
}

// A map of functions which return data for the schema.
const resolvers = {
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
			return await context.applicationServices.Community.create({
                name: args.input.name,
                createdByEndUserId: args.input.createdByEndUserId
            });
        }
    }
};

/**
 * Recursively collects all leaf field paths from a GraphQL selection set.
 * Delegates handling of each selection type to specialized helper functions for maintainability.
 *
 * Args:
 *   selectionSet: The current selection set node.
 *   fragments: A map of fragment definitions.
 *   out: A set to accumulate the resulting field paths.
 *   parentPath: The current dot-separated path prefix.
 */
function collectFieldPaths(
  selectionSet: SelectionSetNode | undefined,
  fragments: Record<string, FragmentDefinitionNode>,
  out: Set<string>,
  parentPath = ''
) {
  if (!selectionSet) { return; }

  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case 'Field':
        handleFieldSelection(selection, fragments, out, parentPath);
        break;
      case 'FragmentSpread':
        handleFragmentSpread(selection, fragments, out, parentPath);
        break;
      case 'InlineFragment':
        handleInlineFragment(selection, fragments, out, parentPath);
        break;
    }
  }
}

/**
 * Handles a Field selection node, recursing into sub-selections or adding leaf paths.
 */
function handleFieldSelection(
  selection: Extract<SelectionSetNode['selections'][number], { kind: 'Field' }>,
  fragments: Record<string, FragmentDefinitionNode>,
  out: Set<string>,
  parentPath: string
) {
  const name = selection.name.value;
  if (name === '__typename') { return; }

  const path = parentPath ? `${parentPath}.${name}` : name;

  if (selection.selectionSet) {
    collectFieldPaths(selection.selectionSet, fragments, out, path);
  } else {
    out.add(path);
  }
}

/**
 * Handles a FragmentSpread selection node by recursing into the referenced fragment.
 */
function handleFragmentSpread(
  selection: Extract<SelectionSetNode['selections'][number], { kind: 'FragmentSpread' }>,
  fragments: Record<string, FragmentDefinitionNode>,
  out: Set<string>,
  parentPath: string
) {
  const fragment = fragments[selection.name.value];
  if (fragment) {
    collectFieldPaths(fragment.selectionSet, fragments, out, parentPath);
  }
}

/**
 * Handles an InlineFragment selection node by recursing into its selection set.
 */
function handleInlineFragment(
  selection: Extract<SelectionSetNode['selections'][number], { kind: 'InlineFragment' }>,
  fragments: Record<string, FragmentDefinitionNode>,
  out: Set<string>,
  parentPath: string
) {
  collectFieldPaths(selection.selectionSet, fragments, out, parentPath);
}

function getRequestedFieldPaths(info: GraphQLResolveInfo): string[] {
  const out = new Set<string>();
  const node = info.fieldNodes[0];
  collectFieldPaths(node?.selectionSet, info.fragments, out);
  return Array.from(out);
}

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
