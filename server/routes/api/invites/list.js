import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import Invite from '#models/invite.js';

export default async function (fastify, opts) {
  fastify.get('/', {
    schema: {
      description: 'Returns a paginated list of Invites.',
      querystring: z.object({
        page: z.number().optional(),
        perPage: z.number().optional(),
      }),
      response: {
        [StatusCodes.OK]: z.array(Invite.ResponseSchema),
        [StatusCodes.FORBIDDEN]: z.null(),
      }
    },
    onRequest: fastify.requireAdmin
  },
  async function (request, reply) {
    const { page = '1', perPage = '25' } = request.query;
    const options = {
      page,
      perPage,
      orderBy: [
        { createdAt: 'desc' },
        { lastName: 'asc' },
        { firstName: 'asc' },
        { email: 'asc' }
      ]
    };
    const { records, total } = await fastify.prisma.invite.paginate(options);
    reply.setPaginationHeaders(page, perPage, total).send(records);
  });
}
