import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { User } from '@prisma/client';
import { UserType } from './type.js';

type ChangeUser = {
  id: string;
  dto: Omit<User, 'id'>;
};

type CreateUser = {
  dto: Omit<User, 'id'>;
};

type DeleteUser = {
  id: string;
};

type Args = {
  userId: string;
  authorId: string;
};

const subscribedToResolver = async (
  _source: unknown,
  { userId, authorId }: Args,
  { prisma }: Context,
) => {
  await prisma.user.update({
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

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

async function createUserResolver(
  _source: unknown,
  { dto }: CreateUser,
  { prisma }: Context,
) {
  return await prisma.user.create({
    data: dto,
  });
}

async function changeUserResolver(
  _source: unknown,
  { id, dto }: ChangeUser,
  { prisma }: Context,
) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: dto,
  });
}

async function deleteUserResolver(
  _source: unknown,
  { id }: DeleteUser,
  { prisma }: Context,
) {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return user.id;
}

async function unsubscribeFromResolver(
  _source: unknown,
  { userId, authorId }: Args,
  { prisma }: Context,
) {
  const subscription = await prisma.subscribersOnAuthors.delete({
    where: {
      subscriberId_authorId: {
        subscriberId: userId,
        authorId,
      },
    },
  });
  return subscription.authorId;
}

const createUser: GraphQLFieldConfig<void, Context, CreateUser> = {
  type: UserType as GraphQLObjectType,
  args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
  resolve: createUserResolver,
};

const changeUser: GraphQLFieldConfig<void, Context, ChangeUser> = {
  type: UserType as GraphQLObjectType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: changeUserResolver,
};

const deleteUser: GraphQLFieldConfig<void, Context, DeleteUser> = {
  type: new GraphQLNonNull(UUIDType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: deleteUserResolver,
};

const subscribeTo: GraphQLFieldConfig<void, Context, Args> = {
  type: GraphQLBoolean,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: subscribedToResolver,
};

const unsubscribeFrom: GraphQLFieldConfig<void, Context, Args> = {
  type: UUIDType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: unsubscribeFromResolver,
};

export const userMutations = {
  subscribeTo,
  unsubscribeFrom,
  deleteUser,
  createUser,
  changeUser,
};
