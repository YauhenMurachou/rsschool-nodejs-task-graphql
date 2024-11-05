import { GraphQLObjectType, GraphQLString } from 'graphql';
import { Post as PostType } from '@prisma/client';
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

export type BasicArgs = {
  id: string;
};

export type CreatePost = {
  dto: Omit<PostType, 'id'>;
};

export type UpdatePost = {
  id: string;
  dto: Omit<PostType, 'id'>;
};
