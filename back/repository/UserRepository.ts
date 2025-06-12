import { PrismaClient, UserRole, type User } from '@prisma/client';

export class UserRepository {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getUser(username: string): Promise<User> {
    return await this.db.user.findUnique({ where: { username } });
  }

  async getRole(id: string): Promise<UserRole> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: { role: true }
    });

    return user?.role;
  }

  async createUser(username: string, passwordHash: string, role: UserRole): Promise<User> {
    return await this.db.user.create({
      data: { username, passwordHash, role }
    });
  }

}