import fp from 'fastify-plugin';

import prisma from '#prisma/client.js';

const prismaPlugin = fp(async (fastify) => {
  await prisma.$connect();

  // Make Prisma Client available through the fastify server instance: server.prisma
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (fastify) => {
    await fastify.prisma.$disconnect();
  });
});

export default prismaPlugin;
