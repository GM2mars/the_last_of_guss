import { PrismaClient, UserRole } from '@prisma/client';

export class GameRepository {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createRound(data: { startTime: Date, endTime: Date }) {
    return await this.db.round.create({ data });
  }

  async getRounds() {
    return await this.db.round.findMany({
      take: 100,
      orderBy: [
        { createdAt: 'desc' }
      ],
    });
  }

  async getRound(id: string) {
    const roundStats = await this.db.round.findUnique({
      where: { id },
      include: {
        stats: {
          include: {
            user: {
              select: {
                username: true,
                id: true
              }
            }
          }
        }
      }
    });

    return roundStats;
  }

  async updateScore(userId: string, roundId: string) {
    //создаем транзакцию для лока записи
    const score = await this.db.$transaction(async (tx) => {
      const roundInfo = await this.db.round.findUnique({
        where: { id: roundId },
        select: { startTime: true, endTime: true }
      });

      const currentTime = new Date().getTime();
      const startTime = new Date(roundInfo.startTime).getTime();
      const endTime = new Date(roundInfo.endTime).getTime();

      //проверяем что раунд сейчас в активной фазе
      if (currentTime > startTime && currentTime < endTime) {
        //делаем upsert, чтоб получить игрока если он есть, иначе создаем его
        const playerStats = await tx.playerRoundStats.upsert({
          where: { userId_roundId: { userId, roundId } },
          create: {
            userId,
            roundId
          },
          update: {},
          include: { user: true }
        });

        //считаем тапы и очки с учетом роли и бонуса за каждый 10-й тап
        const userRole = playerStats.user.role;
        const newTapCount = playerStats.taps + 1;
        const newScoreCount = newTapCount % 11 === 0 ? 10 : 1;
        const newScore = userRole === UserRole.NIKITA ? 0 : playerStats.score + newScoreCount;

        //обновляем статистику
        await tx.playerRoundStats.update({
          where: { id: playerStats.id },
          data: {
            taps: newTapCount,
            score: newScore,
          }
        });

        return newScore;
      }

      return 0;
    });

    return score;
  }
}