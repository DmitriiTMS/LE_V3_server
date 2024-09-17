import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { VideosModule } from './videos/videos.module';


@Module({
  imports: [PrismaModule, VideosModule],
})
export class AppModule {}
