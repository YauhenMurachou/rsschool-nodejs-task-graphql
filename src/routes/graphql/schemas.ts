import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypeQueries } from './member-types/query.js';
import { postQueries } from './posts/query.js';
import { postMutations } from './posts/mutation.js';
import { profileQueries } from './profiles/query.js';
import { profileMutations } from './profiles/mutation.js';
import { userMutations } from './users/mutation.js';
import { userQueries } from './users/query.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const queryFields = {
  ...postQueries,
  ...memberTypeQueries,
  ...profileQueries,
  ...userQueries,
};

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => queryFields,
});

const mutationFields = {
  ...userMutations,
  ...postMutations,
  ...profileMutations,
};

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => mutationFields,
});

export const gqlSchema = new GraphQLSchema({ query, mutation });
