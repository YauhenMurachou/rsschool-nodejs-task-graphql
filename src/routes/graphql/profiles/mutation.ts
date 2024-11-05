import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLFieldConfig,
} from 'graphql';
import { Context } from '../types/context.js';
import { MembershipLevel } from '../member-types/type.js';
import { UUIDType } from '../types/uuid.js';
import { BasicArgs, ChangeProfile, CreateProfile, ProfileType } from './type.js';

const UuidInput = { type: new GraphQLNonNull(UUIDType) };

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MembershipLevel) },
    userId: UuidInput,
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
  { id }: BasicArgs,
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
    id: UuidInput,
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: changeProfileResolver,
};

const deleteProfile: GraphQLFieldConfig<void, Context, BasicArgs> = {
  type: UuidInput.type,
  args: { id: UuidInput },
  resolve: deleteProfileResolver,
};

export const profileMutations = {
  changeProfile,
  createProfile,
  deleteProfile,
};
