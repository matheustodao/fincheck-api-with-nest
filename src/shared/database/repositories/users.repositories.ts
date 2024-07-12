import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class UsersRepositories {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDTO: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createDTO);
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  findById(id: string, options?: Partial<Prisma.UserFindUniqueArgs>) {
    const optionsParsed = {
      where: { id },
    } as Prisma.UserFindUniqueArgs;

    if (typeof options !== 'undefined') {
      Object.assign(optionsParsed, options);
    }

    return this.prismaService.user.findUnique(optionsParsed);
  }
}
