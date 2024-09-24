import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Поле email не валидно' })
  email: string;

  @IsOptional()
  @IsString()
  instagramName: string;

  @IsOptional()
  @IsBoolean()
  isHasPremium: boolean;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
