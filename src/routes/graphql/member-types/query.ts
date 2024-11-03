import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { MembershipLevel, MemberType } from './type.js';
import { Context } from '../types/context.js';

type Args = {
  id: string;
};

const MemberTypeInput = {
  id: { type: new GraphQLNonNull(MembershipLevel) },
};

async function fetchMemberTypes(_source: unknown, _args: unknown, { prisma }: Context) {
  return await prisma.memberType.findMany();
}

async function fetchMemberType(_source: unknown, { id }: Args, { prisma }: Context) {
  return await prisma.memberType.findUnique({
    where: { id },
  });
}

const memberTypes: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(MemberType),
  resolve: fetchMemberTypes,
};

const memberType: GraphQLFieldConfig<void, Context, Args> = {
  type: MemberType,
  args: MemberTypeInput,
  resolve: fetchMemberType,
};

export const memberTypeQueries = {
  memberTypes,
  memberType,
};
