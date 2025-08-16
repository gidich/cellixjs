import type { GraphQLResolveInfo } from "graphql";
import type { GraphContext } from "../../init/context.ts";
import type { EndUser, Resolvers } from "../builder/generated.ts";
import { getRequestedFieldPaths } from "../resolver-helper.ts";

const endUser: Resolvers = {
    Query: {
        currentEndUserAndCreateIfNotExists: async (_parent: unknown, _args: unknown, context: GraphContext, _info: GraphQLResolveInfo) => {
            if (!context.applicationServices.verifiedUser?.verifiedJwt) { throw new Error('Unauthorized'); }
            return await context.applicationServices.User.EndUser.createIfNotExists({
                externalId: context.applicationServices.verifiedUser.verifiedJwt?.sub,
                lastName: context.applicationServices.verifiedUser.verifiedJwt?.family_name,
                restOfName: context.applicationServices.verifiedUser.verifiedJwt?.given_name,
                email: context.applicationServices.verifiedUser.verifiedJwt?.email
            }) as EndUser;
        },
        endUserById: async (_parent: unknown, args: { id: string }, context: GraphContext, info: GraphQLResolveInfo) => {
            return await context.applicationServices.User.EndUser.queryById({
                id: args.id,
                fields: getRequestedFieldPaths(info)
            }) as EndUser;
        },
    },
};

export default endUser;