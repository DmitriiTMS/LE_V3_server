import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле «Название видео» обязательно для заполнения' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле «Описание видео» обязательно для заполнения' })
  description: string;

  @IsOptional()
  url: string;
}
