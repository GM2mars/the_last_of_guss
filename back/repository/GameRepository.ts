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
    // Создаем транзакцию для лока записи
    const score = await this.db.$transaction(async (tx) => {
      const roundInfo = await tx.round.findUnique({
        where: { id: roundId },
        select: { startTime: true, endTime: true }
      });

      if (!roundInfo) throw new Error('Round not found');

      const currentTime = new Date().getTime();
      const startTime = new Date(roundInfo.startTime).getTime();
      const endTime = new Date(roundInfo.endTime).getTime();

      // Проверяем что раунд сейчас в активной фазе
      if (currentTime > startTime && currentTime < endTime) {
        // Получаем информацию о пользователе для определения роли
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        if (!user) throw new Error('User not found');

        // Используем upsert для учета тапов
        const playerStats = await tx.playerRoundStats.upsert({
          where: {
            userId_roundId: { userId, roundId }
          },
          create: {
            userId,
            roundId,
            taps: 1,
            score: 0
          },
          update: {
            taps: { increment: 1 }
          },
          select: {
            taps: true,
            score: true
          }
        });

        if (user.role === 'NIKITA') return 0;

        const scoreIncrement = playerStats.taps % 11 === 0 ? 10 : 1;

        //обновляем счет
        const updatedStats = await tx.playerRoundStats.update({
          where: {
            userId_roundId: { userId, roundId }
          },
          data: {
            score: { increment: scoreIncrement }
          },
          select: {
            score: true
          }
        });

        return updatedStats.score;
      }

      return 0;
    });

    return score;
  }

}