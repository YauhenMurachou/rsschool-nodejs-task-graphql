import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { Profile } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
import { MembershipLevel, MemberType } from '../member-types/type.js';
import { Context } from '../types/context.js';

type Args = {
  memberTypeId: string;
};

async function memberTypeResolver(
  { memberTypeId }: Args,
  _source: unknown,
  { prisma }: Context,
) {
  return await prisma.memberType.findUnique({
    where: { id: memberTypeId },
  });
}

const profileFields = {
  id: { type: UUIDType },
  isMale: { type: GraphQLBoolean },
  yearOfBirth: { type: GraphQLInt },
  userId: { type: UUIDType },
  memberTypeId: { type: MembershipLevel },
  memberType: {
    type: MemberType,
    resolve: memberTypeResolver,
  },
};

export const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: 'Profile',
  fields: () => profileFields,
});
