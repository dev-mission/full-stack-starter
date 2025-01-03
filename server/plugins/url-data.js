import fp from 'fastify-plugin';
import urlData from '@fastify/url-data';

/**
 * This plugins adds URL parsing to the request object
 *
 * @see https://github.com/fastify/fastify-url-data
 */
export default fp(async (fastify) => {
  fastify.register(urlData);
});
