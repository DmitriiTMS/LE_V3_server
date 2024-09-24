import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @Auth()
  findAll() {
    return this.videosService.findAll();
  }

  // ADMIN

  @Post()
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('url', { storage: storageConfig('videos') }))
  create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const pathFile = file.destination + '/' + file.filename;
    return this.videosService.create(createVideoDto, pathFile);
  }

  @Get(':id')
  @Auth('admin')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Patch(':id')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('url', { storage: storageConfig('videos') }))
  update(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let pathFile: string;

    if (typeof file !== 'undefined') {
      pathFile = file.destination + '/' + file.filename;
    }

    return this.videosService.update(id, updateVideoDto, pathFile);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
