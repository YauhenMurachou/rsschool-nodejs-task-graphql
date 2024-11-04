import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../types/context.js';
import { Post, BasicArgs } from './type.js';
import { UUIDType } from '../types/uuid.js';

const PostInput = {
  id: { type: new GraphQLNonNull(UUIDType) },
};

async function fetchAllPosts(_source: unknown, _args: unknown, { prisma }: Context) {
  return await prisma.post.findMany();
}

async function fetchSinglePost(_source: unknown, { id }: BasicArgs, { prisma }: Context) {
  return await prisma.post.findUnique({ where: { id } });
}

const posts: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(Post),
  resolve: fetchAllPosts,
};

const post: GraphQLFieldConfig<void, Context, BasicArgs> = {
  type: Post,
  args: PostInput,
  resolve: fetchSinglePost,
};

export const postQueries = {
  posts,
  post,
};
