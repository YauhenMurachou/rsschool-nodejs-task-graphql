import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const DEPTH_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const validationErrors = validate(gqlSchema, parse(query), [
        depthLimit(DEPTH_LIMIT),
      ]);

      if (validationErrors.length) {
        return { errors: validationErrors };
      }

      return await graphql({
        contextValue: {
          prisma,
          loaders: new WeakMap(),
        },
        schema: gqlSchema,
        source: query,
        variableValues: variables,
      });
    },
  });
};

export default plugin;
