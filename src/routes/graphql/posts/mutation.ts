import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Context } from '../types/context.js';
import { CreatePost, Post as PostType, BasicArgs, UpdatePost } from './type.js';
import { UUIDType } from '../types/uuid.js';

const UuidInput = { type: new GraphQLNonNull(UUIDType) };

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: UuidInput,
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
  { id }: BasicArgs,
  { prisma }: Context,
) {
  const post = await prisma.post.delete({ where: { id } });
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
    id: UuidInput,
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  resolve: changePostResolver,
};

const deletePost: GraphQLFieldConfig<void, Context, BasicArgs> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: UuidInput },
  resolve: deletePostResolver,
};

export const postMutations = {
  changePost,
  createPost,
  deletePost,
};
