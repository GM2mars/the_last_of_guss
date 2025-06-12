import type { FastifyInstance, FastifyRequest } from 'fastify';
import type WebSocket from 'ws';

import { WsService } from '@/services/WsService';

export enum WsEvents {
  Ping = "ping",
  Pong = "pong",
  Game = "game",
  Round = "round",
}

export enum GameEvent {
  UpdateRounds = "updateRounds",
}

export enum RoundEvent {
  ConnectToRound = "connectToRound",
  IncreaseScore = "increaseScore",
  GetRoundStats = "getRoundStats",
}

export async function WsController(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true }, (socket: WebSocket, req: FastifyRequest) => {
    const ws = new WsService(socket);
    const token = req.cookies?.sessionId;

    if (!token) {
      ws.close();
      return;
    }

    fastify.activeConnections.set(token, socket);

    ws.on(WsEvents.Round, async ({ action, data }) => {
      switch (action) {
        case RoundEvent.GetRoundStats: {
          const round = await fastify.gameService.getRoundStats(data.id);

          fastify.activeRounds.set(token, data.id);

          ws.send(WsEvents.Round, { action: RoundEvent.GetRoundStats, data: round });
          break;
        }
        case RoundEvent.IncreaseScore: {
          const roundId = fastify.activeRounds.get(token);

          if (!roundId) return;

          const score = await fastify.gameService.increaseScore(token, roundId);

          ws.send(WsEvents.Round, { action: RoundEvent.IncreaseScore, data: score });
          break;
        }
      }
    });

    socket.on('close', () => {
      fastify.activeConnections.delete(token);
      console.log(`Connection closed for user ${token}`);
    });
  });
}