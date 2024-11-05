import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Post } from '../posts/type.js';
import { ProfileType } from '../profiles/type.js';
import { User } from '@prisma/client';
import { Context } from '../types/context.js';

export type BasicArgs = {
  id: string;
};

export type ChangeUser = {
  id: string;
  dto: Omit<User, 'id'>;
};

export type CreateUser = {
  dto: Omit<User, 'id'>;
};

export type SubscribeUnsubscribe = {
  userId: string;
  authorId: string;
};

async function postsResolver({ id }: BasicArgs, _source: unknown, { prisma }: Context) {
  return await prisma.post.findMany({
    where: {
      authorId: id,
    },
  });
}

async function profileResolver({ id }: BasicArgs, _source: unknown, { prisma }: Context) {
  return await prisma.profile.findUnique({
    where: {
      userId: id,
    },
  });
}

async function subscribedToUserResolver(
  { id }: BasicArgs,
  _source: unknown,
  { prisma }: Context,
) {
  return await prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: id,
        },
      },
    },
  });
}

async function userSubscribedToResolver(
  { id }: BasicArgs,
  _source: unknown,
  { prisma }: Context,
) {
  return await prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: id,
        },
      },
    },
  });
}

export const UserType = new GraphQLObjectType<User, Context>({
  name: 'User',
  fields: () => ({
    balance: { type: GraphQLFloat },
    id: { type: UUIDType },
    name: { type: GraphQLString },
    posts: {
      type: new GraphQLList(Post),
      resolve: postsResolver,
    },
    profile: {
      type: ProfileType,
      resolve: profileResolver,
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: subscribedToUserResolver,
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: userSubscribedToResolver,
    },
  }),
});
