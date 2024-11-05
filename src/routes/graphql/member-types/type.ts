import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

const memberTypeIdValues = {
  BASIC: { value: MemberTypeId.BASIC },
  BUSINESS: { value: MemberTypeId.BUSINESS },
};

export const MembershipLevel = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: memberTypeIdValues,
});

const memberTypeFields = {
  discount: { type: GraphQLFloat },
  id: { type: MembershipLevel },
  postsLimitPerMonth: { type: GraphQLInt },
};

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => memberTypeFields,
});
