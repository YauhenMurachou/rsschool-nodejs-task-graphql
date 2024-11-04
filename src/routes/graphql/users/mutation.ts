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
import {
  BasicArgs,
  ChangeUser,
  CreateUser,
  SubscribeUnsubscribe,
  UserType,
} from './type.js';

const UuidInput = { type: new GraphQLNonNull(UUIDType) };
const subscribeArgs = {
  userId: UuidInput,
  authorId: UuidInput,
};

const subscribedToResolver = async (
  _source: unknown,
  { userId, authorId }: SubscribeUnsubscribe,
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
  { id }: BasicArgs,
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
  { userId, authorId }: SubscribeUnsubscribe,
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
    id: UuidInput,
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: changeUserResolver,
};

const deleteUser: GraphQLFieldConfig<void, Context, BasicArgs> = {
  type: UuidInput.type,
  args: {
    id: UuidInput,
  },
  resolve: deleteUserResolver,
};

const subscribeTo: GraphQLFieldConfig<void, Context, SubscribeUnsubscribe> = {
  type: GraphQLBoolean,
  args: subscribeArgs,
  resolve: subscribedToResolver,
};

const unsubscribeFrom: GraphQLFieldConfig<void, Context, SubscribeUnsubscribe> = {
  type: UUIDType,
  args: subscribeArgs,
  resolve: unsubscribeFromResolver,
};

export const userMutations = {
  subscribeTo,
  unsubscribeFrom,
  deleteUser,
  createUser,
  changeUser,
};
