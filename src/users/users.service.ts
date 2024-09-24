import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(dto: AuthDto) {
    const user = {
      name: dto.name,
      email: dto.email,
      instagramName: dto.instagramName,
      password: await hash(dto.password),
    };

    return await this.prisma.user.create({
      data: user,
    });
  }
}
