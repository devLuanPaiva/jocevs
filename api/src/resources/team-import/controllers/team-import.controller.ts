import { Body, Controller, Post } from '@nestjs/common';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { ImportTeamsDto } from '../dto/import-teams.dto';
import type { TeamImportResponseDto } from '../dto/team-import-response.dto';
import { TeamImportService } from '../services/team-import.service';

@Controller('team-imports')
export class TeamImportController {
  public constructor(private readonly teamImportService: TeamImportService) {}

  @Post()
  @RequirePermission(Permission.TEAM_MANAGE)
  public importTeams(@Body() input: ImportTeamsDto): Promise<TeamImportResponseDto> {
    return this.teamImportService.importTeams(input);
  }
}
