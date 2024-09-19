import { ConflictException, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from 'prisma/prisma.service';

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

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
