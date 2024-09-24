import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty({message: 'Поле email обязательно для заполнения'})
  @IsEmail({}, { message: 'Введите валидный email' })
  email: string;

  @IsString()
  @MinLength(6, {message: 'Пароль должен содержать минимум 6 символов!'})
  password: string;

  @IsOptional()
  @IsNotEmpty({message: 'Поле instagramName обязательно для заполнения'})
  @IsString()
  instagramName: string;
}
