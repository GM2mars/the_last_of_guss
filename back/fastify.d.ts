import type WebSocket from 'ws';

import { UserServiceType } from '@/services/UserService';
import type { GameServiceType } from '@/services/GameService';
// import type { RoundServiceType } from '@/services/RoundService';

declare module 'fastify' {
  interface FastifyInstance {
    userService: UserServiceType;
    gameService: GameServiceType;
    // roundService: RoundServiceType;
    activeConnections: Map<string, WebSocket>;
    activeRounds: Map<string, string>;
  }
}