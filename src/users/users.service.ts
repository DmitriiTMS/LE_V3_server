import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  // ADMIN
  async getAll() {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        name: true,
        email: true,
        instagramName: true,
        isHasPremium: true,
        role: true,
      },
    });

    return { users };
  }

  async getOne(id: string) {
    const user = await this.getById(id);

    if (!user) throw new NotFoundException('Пользователь не найден');

    const userFind = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
        instagramName: true,
        isHasPremium: true,
        role: true,
      },
    });

    return { user: userFind };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.getById(id);

    if (!user) throw new NotFoundException('Пользователь не найден');

    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    return { user: userUpdate };
  }

  async remove(id: string) {
    const user = await this.getById(id);

    if (!user) throw new NotFoundException('Пользователь не найден');

    const deleteUser = await this.prisma.user.delete({
      where: { id },
    });

    return {
      user: {
        name: deleteUser.name,
      },
    };
  }
}
