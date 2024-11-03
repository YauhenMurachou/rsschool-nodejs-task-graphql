import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../types/context.js';
import { Post } from './type.js';
import { UUIDType } from '../types/uuid.js';

type Args = {
  id: string;
};

const PostInput = {
  id: { type: new GraphQLNonNull(UUIDType) },
};

async function fetchAllPosts(_source: unknown, _args: unknown, { prisma }: Context) {
  return await prisma.post.findMany();
}

async function fetchSinglePost(_source: unknown, { id }: Args, { prisma }: Context) {
  return await prisma.post.findUnique({ where: { id } });
}

const posts: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(Post),
  resolve: fetchAllPosts,
};

const post: GraphQLFieldConfig<void, Context, Args> = {
  type: Post,
  args: PostInput,
  resolve: fetchSinglePost,
};

export const postQueries = {
  posts,
  post,
};
