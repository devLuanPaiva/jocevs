import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { TeamController } from './TeamController.controller';
import { TeamProvider } from './TeamProvider.provider';

@Module({
  imports: [PrismaModule],
  controllers: [TeamController],
  providers: [TeamProvider],
})
export class TeamModule {}
