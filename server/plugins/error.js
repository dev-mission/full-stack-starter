import fp from 'fastify-plugin';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

/**
 * This plugin adds custom error handling for ZodError validation errors.
 *
 */
export default fp(async (fastify) => {
  fastify.decorate('ValidationErrorSchema', z.object({
    statusCode: z.number(),
    errors: z.array(z.object({
      path: z.string(),
      message: z.string()
    })),
  }));
  fastify.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      return reply.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.validation.map(({ params: { issue: { path, message } } }) => ({ path: path[0], message })),
      });
    }
    // re-throw error to be handled by Fastify
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    throw error;
  });
});
