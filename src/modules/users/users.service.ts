import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';
import { CategoryConstants } from 'src/shared/constants/category.constants';
import { UsersRepositories } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepositories) {}

  async create({ email, name, password }: CreateUserDto) {
    const emailAlreadyTaken = await this.usersRepo.findByEmail(email);

    if (emailAlreadyTaken) {
      throw new ConflictException('This email is already in use');
    }

    const hashedPassword = await hash(password, 12);

    const created = await this.usersRepo.create({
      data: {
        name,
        email,
        password: hashedPassword,
        category: {
          createMany: {
            data: CategoryConstants as never,
          },
        },
      },

      include: {
        bankAccounts: true,
        category: true,
        transaction: true,
      },
    });

    return created;
  }
}
