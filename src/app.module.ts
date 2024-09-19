import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { VideosModule } from './videos/videos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

@Module({
  imports: [
    PrismaModule,
    VideosModule,
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: `/uploads`,
    }),
  ],
})
export class AppModule {}
