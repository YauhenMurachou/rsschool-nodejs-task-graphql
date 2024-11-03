import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../types/context.js';
import { ProfileType } from './type.js';
import { UUIDType } from '../types/uuid.js';

type Args = {
  id: string;
};

const ProfileInput = {
  id: { type: new GraphQLNonNull(UUIDType) },
};

async function fetchAllProfiles(_source: unknown, _args: unknown, { prisma }: Context) {
  return await prisma.profile.findMany();
}

async function fetchSingleProfile(_source: unknown, { id }: Args, { prisma }: Context) {
  return await prisma.profile.findUnique({
    where: { id },
  });
}

const profiles: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(ProfileType),
  resolve: fetchAllProfiles,
};

const profile: GraphQLFieldConfig<void, Context, Args> = {
  type: ProfileType,
  args: ProfileInput,
  resolve: fetchSingleProfile,
};

export const profileQueries = {
  profiles,
  profile,
};
