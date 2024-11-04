import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLFieldConfig,
} from 'graphql';
import { Context } from '../types/context.js';
import { Profile } from '@prisma/client';
import { MembershipLevel } from '../member-types/type.js';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from './type.js';

type ChangeProfile = {
  id: string;
  dto: Omit<Profile, 'id' | 'userId'>;
};

type CreateProfile = {
  dto: Omit<Profile, 'id'>;
};

type DeleteProfile = {
  id: string;
};

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MembershipLevel) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MembershipLevel },
  }),
});

async function createProfileResolver(
  _source: unknown,
  { dto }: CreateProfile,
  { prisma }: Context,
) {
  return await prisma.profile.create({
    data: dto,
  });
}

async function changeProfileResolver(
  _source: unknown,
  { id, dto }: ChangeProfile,
  { prisma }: Context,
) {
  return await prisma.profile.update({
    where: { id },
    data: dto,
  });
}

async function deleteProfileResolver(
  _source: unknown,
  { id }: DeleteProfile,
  { prisma }: Context,
) {
  const profile = await prisma.profile.delete({
    where: {
      id,
    },
  });
  return profile.id;
}

const createProfile: GraphQLFieldConfig<void, Context, CreateProfile> = {
  type: ProfileType,
  args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
  resolve: createProfileResolver,
};

const changeProfile: GraphQLFieldConfig<void, Context, ChangeProfile> = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: changeProfileResolver,
};

const deleteProfile: GraphQLFieldConfig<void, Context, DeleteProfile> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: deleteProfileResolver,
};

export const profileMutations = {
  changeProfile,
  createProfile,
  deleteProfile,
};
