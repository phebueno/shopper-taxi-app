import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
