import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '@prisma/client';

export async function GameController(fastify: FastifyInstance) {
  fastify.post('/create', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.cookies?.sessionId;
      const { role } = await fastify.userService.getRole(token);

      if (role !== UserRole.ADMIN) return reply.code(403).send({ error: 'Forbidden' });

      const round = await fastify.gameService.createRound();

      return reply.code(200).send(round);
    } catch (error: any) {
      return reply.code(401).send({ error: error.message });
    }
  });

  fastify.post('/rounds', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await fastify.gameService.getRounds();

      return reply.code(200).send(data);
    } catch (error: any) {
      return reply.code(401).send({ error: error.message });
    }
  });

  fastify.post('/rounds/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const id = (request.params as any)?.id;
      const data = await fastify.gameService.getRound(id);

      return reply.code(200).send(data);
    } catch (error: any) {
      return reply.code(401).send({ error: error.message });
    }
  });
}