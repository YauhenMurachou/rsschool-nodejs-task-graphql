import { GraphQLBoolean, GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';

type Args = {
  userId: string;
  authorId: string;
};

const subscribedToResolver = async (
  _source: unknown,
  { userId, authorId }: Args,
  { prisma }: Context,
) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      userSubscribedTo: {
        create: {
          authorId,
        },
      },
    },
  });
};

const subscribeTo: GraphQLFieldConfig<void, Context, Args> = {
  type: GraphQLBoolean,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: subscribedToResolver,
};

export const userMutations = {
  subscribeTo,
};
