import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { PrismaClient } from '@prisma/client';
import type WebSocket from 'ws';

import { WsController } from '@/controllers/WsController';
import { GameController } from '@/controllers/GameController';
import { AuthController } from '@/controllers/AuthController';
import { UserService } from '@/services/UserService';
import { GameService } from '@/services/GameService';
import { UserRepository } from '@/repository/UserRepository';
import { GameRepository } from '@/repository/GameRepository';

import { cookieConfig, corsConfig } from './config';

const prisma = new PrismaClient();
const userService = UserService.getInstance(new UserRepository(prisma));
const gameService = GameService.getInstance(new GameRepository(prisma));

const server = Fastify({
  // logger: true
});

server
  .decorate('userService', userService)
  .decorate('gameService', gameService)
  .decorate('activeConnections', new Map<string, WebSocket>())
  .decorate('activeRounds', new Map<string, string>());

server
  .register(fastifyWebsocket)
  .register(WsController);

server
  .register(fastifyCors, corsConfig)
  .register(fastifyCookie, cookieConfig);

server
  .register(AuthController, { prefix: '/api/auth' })
  .register(GameController, { prefix: '/api/game' });


const start = async () => {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    server.log.info(`Server is running on http://localhost:3001`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();