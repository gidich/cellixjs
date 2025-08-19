import type { Domain } from "@ocom/api-domain";
import type { GraphQLResolveInfo } from "graphql";
import type { GraphContext } from "../../init/context.ts";
import type { Community, CommunityCreateInput, CommunityMutationResult, Resolvers } from "../builder/generated.ts";

const CommunityMutationResolver = async (getCommunity: Promise<Domain.Contexts.Community.Community.CommunityEntityReference>): Promise<CommunityMutationResult> => {
  try {
    return {
      status: { success: true },
      community: (await getCommunity) as Community,
    } as CommunityMutationResult;
  } catch (error) {
    console.error('Community > Mutation  : ', error);
    const { message } = error as Error;
    return {
      status: { success: false, errorMessage: message  },
    } as CommunityMutationResult;
  }
};

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
            return await context.applicationServices.Community.Community.queryByEndUserExternalId({
                externalId: context.applicationServices.verifiedUser.verifiedJwt.sub
            }) as Community[];
        }
    },
    Mutation: {
        communityCreate: async (_parent: unknown, args: { input: CommunityCreateInput }, context: GraphContext) => {
            if (!context.applicationServices?.verifiedUser?.verifiedJwt?.sub) { throw new Error('Unauthorized'); }
            return await CommunityMutationResolver(context.applicationServices.Community.Community.create({
                name: args.input.name,
                endUserExternalId: context.applicationServices.verifiedUser?.verifiedJwt.sub
            }));
        }
    }
};

export default community;