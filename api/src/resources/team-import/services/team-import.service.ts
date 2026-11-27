import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { MatchGroupService } from '../../match-group/services/match-group.service';
import { TeamService } from '../../team/services/team.service';
import type { ImportTeamsDto } from '../dto/import-teams.dto';
import { TeamImportRepository, type TeamImportSummary } from '../repository/team-import.repository';
import {
  TEAM_NAME_INVALID,
  planTeamImport,
  type ExistingCategoryData,
  type RowProblem,
} from '../rules/team-import.rule';

function toException({ code, detail, field, row }: RowProblem): Error {
  const error = apiError(code, `Linha ${row}: ${detail}`, `rows.${row - 1}.${field}`);
  return code === TEAM_NAME_INVALID ? new BadRequestException(error) : new ConflictException(error);
}

@Injectable()
export class TeamImportService {
  public constructor(
    private readonly teamImportRepository: TeamImportRepository,
    private readonly matchGroupService: MatchGroupService,
    private readonly teamService: TeamService,
  ) {}

  public async importTeams(input: ImportTeamsDto): Promise<TeamImportSummary> {
    const categoryIds = [...new Set(input.rows.map((row) => row.categoryId))];
    const existing = await Promise.all(categoryIds.map((id) => this.loadExisting(id)));
    const { plan, problem } = planTeamImport(input.rows, existing);
    if (problem) {
      throw toException(problem);
    }
    return this.teamImportRepository.saveAll(plan);
  }

  private async loadExisting(categoryId: string): Promise<ExistingCategoryData> {
    const [groups, teams] = await Promise.all([
      this.matchGroupService.listByCategory(categoryId, {}),
      this.teamService.listByCategory(categoryId, {}),
    ]);
    return {
      categoryId,
      groupNames: groups.map((group) => group.name),
      teamNames: teams.map((team) => team.name),
      teamSlugs: teams.map((team) => team.slug),
    };
  }
}
