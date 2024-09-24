import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);

    if (oldUser)
      throw new BadRequestException({
        message: `Пользователь с ${dto.email} уже существует`,
      });

    const user = await this.userService.create(dto);

    const tokens = this.issueToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        instagramName: user.instagramName,
        isHasPremium: user.isHasPremium,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        instagramName: user.instagramName,
        isHasPremium: user.isHasPremium,
        role: user.role,
      },
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verify(refreshToken);

    if (!result) throw new UnauthorizedException('Невалидный refresh токен');

    const user = await this.userService.getById(result.id);
    const tokens = this.issueToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        instagramName: user.instagramName,
        isHasPremium: user.isHasPremium,
        role: user.role,
      },
      ...tokens,
    };
  }

  private issueToken(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) throw new NotFoundException('Пользователь не найден');

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) throw new UnauthorizedException('Неверный пароль');

    return user;
  }
}
