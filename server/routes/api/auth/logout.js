export default async function (fastify, opts) {
  fastify.delete('/logout', async function (request, reply) {
    request.session.delete();
    return reply.send();
  });
}
