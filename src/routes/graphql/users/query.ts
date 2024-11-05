import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../types/context.js';
import { BasicArgs, UserType } from './type.js';
import { UUIDType } from '../types/uuid.js';

const UserInput = {
  id: { type: new GraphQLNonNull(UUIDType) },
};

async function fetchAllUsers(_source: unknown, _args: unknown, { prisma }: Context) {
  return await prisma.user.findMany();
}

async function fetchSingleUser(_source: unknown, { id }: BasicArgs, { prisma }: Context) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

const users: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(UserType),
  resolve: fetchAllUsers,
};

const user: GraphQLFieldConfig<void, Context, BasicArgs> = {
  type: UserType,
  args: UserInput,
  resolve: fetchSingleUser,
};

export const userQueries = {
  users,
  user,
};
