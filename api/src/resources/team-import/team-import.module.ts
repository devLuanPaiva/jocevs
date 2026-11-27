import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchGroupModule } from '../match-group/match-group.module';
import { Team } from '../team/entities/team.entity';
import { TeamModule } from '../team/team.module';
import { TeamImportController } from './controllers/team-import.controller';
import { TeamImportRepository } from './repository/team-import.repository';
import { TeamImportService } from './services/team-import.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), MatchGroupModule, TeamModule],
  controllers: [TeamImportController],
  providers: [TeamImportService, TeamImportRepository],
})
export class TeamImportModule {}
