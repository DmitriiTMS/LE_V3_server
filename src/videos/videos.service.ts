import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as fs from 'fs';
import { path } from 'app-root-path';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVideoDto: CreateVideoDto, pathFile: string) {
    const videoFind = await this.prisma.video.findFirst({
      where: {
        title: createVideoDto.title,
      },
    });

    if (videoFind)
      throw new ConflictException({
        message: `Видео с названием '${createVideoDto.title}' уже создано`,
      });

    const video = await this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        description: createVideoDto.description,
        url: pathFile ? pathFile : '',
      },
    });

    return {
      video: {
        title: video.title,
        description: video.description,
        url: video.url,
      },
      message: 'Видео создано',
    };
  }

  async findAll() {
    const videos = await this.prisma.video.findMany();
    return {
      videos,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  async update(id: string, updateVideoDto: UpdateVideoDto, pathFile: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video)
      throw new BadRequestException({ message: `Видео с ${id} отсутсвует` });

    const videoName = video.url.split('/').at(-1);
    const pathVideoName = `${path}/uploads/videos/${videoName}`;
    if (pathVideoName) {
      fs.unlink(`${path}/uploads/videos/${videoName}`, (err) => {
        if (err) {
          console.log(err);
          throw new BadRequestException('Не удалось обновить видео в проекте');
        }
      });
    } 

    return await this.prisma.video.update({
      where: { id },
      data: {
        title: updateVideoDto.title,
        description: updateVideoDto.description,
        url: pathFile ? pathFile : updateVideoDto.url,
      },
    });
  }

  async remove(id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video)
      throw new BadRequestException({ message: `Видео с ${id} отсутсвует` });

    const videoName = video.url.split('/').at(-1);

    const pathVideoName = `${path}/uploads/videos/${videoName}`;
    if (pathVideoName) {
      fs.unlink(`${path}/uploads/videos/${videoName}`, (err) => {
        if (err) {
          console.log(err);
          throw new BadRequestException('Не удалось удалить видео из проекта');
        }
      });
    }

    return await this.prisma.video.delete({
      where: { id },
      select: {
        title: true,
      },
    });
  }
}
