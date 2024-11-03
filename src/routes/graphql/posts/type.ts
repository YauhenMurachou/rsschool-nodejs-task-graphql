import { GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';

const postFields = {
  authorId: { type: UUIDType },
  content: { type: GraphQLString },
  id: { type: UUIDType },
  title: { type: GraphQLString },
};

export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => postFields,
});
