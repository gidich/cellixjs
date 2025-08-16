import type { GraphQLResolveInfo } from "graphql";
import type { GraphContext } from "../../init/context.ts";
import type { Community, Resolvers } from "../builder/generated.ts";

const community: Resolvers = {
    Query: {
        currentCommunity: async (_parent: unknown, _args: unknown, context: GraphContext, _info: GraphQLResolveInfo) => {
            if (!context.applicationServices.verifiedUser?.hints?.communityId) { throw new Error('Unauthorized'); }
            return await context.applicationServices.Community.Community.queryById({
                id: context.applicationServices.verifiedUser.hints.communityId
            }) as Community;
        },
        communityById: async (_parent: unknown, args: { id: string }, context: GraphContext, _info: GraphQLResolveInfo) => {
            return await context.applicationServices.Community.Community.queryById({
                id: args.id
            }) as Community;
        },
        communitiesForCurrentEndUser: async (_parent: unknown, _args: unknown, context: GraphContext, _info: GraphQLResolveInfo) => {
            if (!context.applicationServices.verifiedUser?.verifiedJwt) { throw new Error('Unauthorized'); }
            // TODO - need to implement aggregate queries in mongo data sources
            // return await context.applicationServices.Community.Community.queryByExternalId({
            //     externalId: context.applicationServices.verifiedUser.verifiedJwt.sub
            // }) as Community[];
            return await Promise.resolve([]) as Community[]; // Placeholder for actual implementation
        }
    },
    // Mutation: {
    //     createCommunity: async (_parent: unknown, args: { input: CommunityCreateInput }, context: GraphContext) => {
    //         if (!context.applicationServices?.verifiedUser?.verifiedJwt?.sub) { throw new Error('Unauthorized'); }
    //         return await context.applicationServices.Community.Community.create({
    //             name: args.input.name,
    //             createdByEndUserId: context.applicationServices.verifiedUser?.verifiedJwt.sub
    //         }) as Community;
    //     }
    // }
};

export default community;