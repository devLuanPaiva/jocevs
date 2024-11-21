import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './db/prisma.module';
import { TeamModule } from './team/TeamModule.module';

@Module({
  imports: [PrismaModule, TeamModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
