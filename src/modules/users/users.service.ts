import { Injectable } from '@nestjs/common';
import { UsersRepositories } from 'src/shared/database/repositories/users.repositories';
@Injectable()
export class UsersService {
  constructor(private readonly UsersRepo: UsersRepositories) {}

  async getUserById(userId: string) {
    const user = await this.UsersRepo.findById(userId);

    return {
      ...user,
      password: undefined,
      id: undefined,
    };
  }
}
