import { v4 } from 'uuid';

import { UserRole } from "@prisma/client";
import type { UserRepository } from "@/repository/UserRepository";

export class UserService {
  private static instance: UserService;
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public static getInstance(repository?: UserRepository): UserService {
    if (!UserService.instance) {
      if (!repository) throw new Error('UserRepository is required');

      UserService.instance = new UserService(repository);
    }

    return UserService.instance;
  }


  async getRole(id: string): Promise<{ role: UserRole }> {
    const role = await this.repository.getRole(id);

    return { role };
  }

  async login(username: string, password: string): Promise<{ error?: string, user?: any }> {
    const user = await this.repository.getUser(username);

    if (user) {
      return user.passwordHash === password
        ? { user }
        : { error: 'Invalid password' };
    }

    return this.createUser(username, password);
  }

  private createUser = async (username: string, password: string) => {
    let role: UserRole;

    switch (username) {
      case 'admin':
        role = UserRole.ADMIN;
        break;
      case 'Никита':
        role = UserRole.NIKITA;
        break;
      default:
        role = UserRole.SURVIVOR;
        break;
    }

    const user = await this.repository.createUser(username, password, role);

    return { user };
  }
}

export type UserServiceType = InstanceType<typeof UserService>;