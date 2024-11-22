import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { GameController } from './GamerController.controller';
import { GamerProvider } from './GamerProvider.provider';

@Module({
  imports: [PrismaModule],
  controllers: [GameController],
  providers: [GamerProvider],
})
export class GamerModule {}
