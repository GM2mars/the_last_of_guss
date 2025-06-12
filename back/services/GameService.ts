import type { GameRepository } from "@/repository/GameRepository";
import type { Round } from "@prisma/client";

export class GameService {
  private static instance: GameService;
  private repository: GameRepository;

  constructor(repository: GameRepository) {
    this.repository = repository;
  }

  public static getInstance(repository?: GameRepository): GameService {
    if (!GameService.instance) {
      if (!repository) throw new Error('GameRepository is required');

      GameService.instance = new GameService(repository);
    }

    return GameService.instance;
  }

  async createRound(): Promise<{ round: Round }> {
    const timestampNow = Date.now() / 1000;
    const startTimestamp = timestampNow + Number(process.env.COOLDOWN_DURATION);
    const endTimestamp = startTimestamp + Number(process.env.ROUND_DURATION);
    const startTime = new Date(startTimestamp * 1000);
    const endTime = new Date(endTimestamp * 1000);

    const round = await this.repository.createRound({ startTime, endTime });

    return { round };
  }

  async getRounds(): Promise<{ rounds: Round[], serverTime: number }> {
    const rounds = await this.repository.getRounds();

    return { rounds, serverTime: Date.now() };
  }

  async getRoundStats(id: string): Promise<{ round: Round, serverTime: number }> {
    const round = await this.repository.getRound(id);
    return { round, serverTime: Date.now() };
  }

  async increaseScore(id: string, roundId: string): Promise<{ score: any }> {
    const score = await this.repository.updateScore(id, roundId);

    return { score };
  }
}

export type GameServiceType = InstanceType<typeof GameService>;