import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { AuthenticateDto } from './dto/authenticate.dto';
import { UsersRepositories } from 'src/shared/database/repositories/users.repositories';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { CategoryConstants } from 'src/shared/constants/category.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate({ email, password }: AuthenticateDto) {
    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const accessToken = await this.generateAccessToken(user.id);

    return { ...user, accessToken, password: undefined };
  }

  async register({ name, email, password }: RegisterUserDto) {
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

    const accessToken = await this.generateAccessToken(created.id);

    return {
      ...created,
      accessToken,
      password: undefined,
    };
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }
}
