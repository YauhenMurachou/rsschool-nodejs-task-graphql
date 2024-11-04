import { Post } from '@prisma/client';
import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Context } from '../types/context.js';
import { Post as PostType } from './type.js';
import { UUIDType } from '../types/uuid.js';

type CreatePost = {
  dto: Omit<Post, 'id'>;
};

type RemovePost = {
  id: string;
};

type UpdatePost = {
  id: string;
  dto: Omit<Post, 'id'>;
};

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

async function createPostResolver(
  _source: unknown,
  { dto }: CreatePost,
  { prisma }: Context,
) {
  return await prisma.post.create({ data: dto });
}

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

async function changePostResolver(
  _source: unknown,
  args: UpdatePost,
  { prisma }: Context,
) {
  return await prisma.post.update({
    where: { id: args.id },
    data: args.dto,
  });
}

async function deletePostResolver(
  _source: unknown,
  { id }: RemovePost,
  { prisma }: Context,
) {
  const post = await prisma.post.delete({ where: { id: id } });
  return post.id;
}

const createPost: GraphQLFieldConfig<void, Context, CreatePost> = {
  type: PostType,
  args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
  resolve: createPostResolver,
};

const changePost: GraphQLFieldConfig<void, Context, UpdatePost> = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  resolve: changePostResolver,
};

const deletePost: GraphQLFieldConfig<void, Context, RemovePost> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: deletePostResolver,
};

export const postMutations = {
  changePost,
  createPost,
  deletePost,
};
