import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface LoginBody {
  username: string;
  password: string;
}

export async function AuthController(fastify: FastifyInstance) {
  fastify.post<{ Body: LoginBody }>('/login', async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    const { username, password } = request.body;

    try {
      const userService = fastify.userService;
      const data = await userService.login(username, password);

      return reply
        .setCookie('sessionId', data.user.id, {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: 30 * 24 * 60 * 60
        })
        .code(200)
        .send(data);
    } catch (error: any) {
      return reply.code(401).send({ error: error.message });
    }
  });

  fastify.get('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    // Логика логаута
    return reply.code(200).send({ status: 'ok' });
  });
}