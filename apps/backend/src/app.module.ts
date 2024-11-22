import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './db/prisma.module';
import { TeamModule } from './team/TeamModule.module';
import { GamerModule } from './games/GamerModule.module';

@Module({
  imports: [PrismaModule, TeamModule, GamerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
