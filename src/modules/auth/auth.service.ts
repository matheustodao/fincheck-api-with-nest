import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';

import { AuthenticateDto } from './dto/authenticate.dto';
import { UsersRepositories } from 'src/shared/database/repositories/users.repositories';
import { JwtService } from '@nestjs/jwt';

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

    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    return { ...user, accessToken };
  }
}
