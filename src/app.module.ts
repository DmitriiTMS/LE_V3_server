import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { VideosModule } from './videos/videos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    VideosModule,
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: `/uploads`,
    }),
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
