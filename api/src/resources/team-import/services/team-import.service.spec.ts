import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import type { MatchGroupService } from '../../match-group/services/match-group.service';
import type { TeamService } from '../../team/services/team.service';
import type { ImportTeamsDto } from '../dto/import-teams.dto';
import type { TeamImportRepository } from '../repository/team-import.repository';
import type { ImportPlan } from '../rules/team-import.rule';
import { TeamImportService } from './team-import.service';

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const SUMMARY = { groupsCreated: 1, teamsCreated: 2 };

function savedPlan(saveAll: jest.Mock): ImportPlan {
  return (saveAll.mock.calls as [[ImportPlan]])[0][0];
}

function input(...names: string[]): ImportTeamsDto {
  return {
    rows: names.map((name) => ({ categoryId: CATEGORY_ID, group: 'A', name, city: 'Viçosa' })),
  };
}

function createFixture(): {
  service: TeamImportService;
  saveAll: jest.Mock;
  listGroups: jest.Mock;
  listTeams: jest.Mock;
} {
  const saveAll = jest.fn().mockResolvedValue(SUMMARY);
  const listGroups = jest.fn().mockResolvedValue([]);
  const listTeams = jest.fn().mockResolvedValue([]);
  const service = new TeamImportService(
    { saveAll } as unknown as TeamImportRepository,
    { listByCategory: listGroups } as unknown as MatchGroupService,
    { listByCategory: listTeams } as unknown as TeamService,
  );
  return { service, saveAll, listGroups, listTeams };
}

describe('TeamImportService', () => {
  it('saves the whole plan at once and returns the summary', async () => {
    const { service, saveAll } = createFixture();

    await expect(service.importTeams(input('Um', 'Dois'))).resolves.toEqual(SUMMARY);
    expect(saveAll).toHaveBeenCalledTimes(1);
    expect(savedPlan(saveAll).teams).toHaveLength(2);
  });

  it('refuses a team that already exists, pointing at the row and field, and saves nothing', async () => {
    const { service, saveAll, listTeams } = createFixture();
    listTeams.mockResolvedValue([{ name: 'Dois', slug: 'dois' }]);

    const failure = service.importTeams(input('Um', 'Dois'));

    await expect(failure).rejects.toBeInstanceOf(ConflictException);
    await expect(failure).rejects.toMatchObject({
      response: {
        code: 'TEAM_NAME_TAKEN',
        detail: 'Linha 2: Já existe um time com este nome na categoria.',
        field: 'rows.1.name',
      },
    });
    expect(saveAll).not.toHaveBeenCalled();
  });

  it('answers 400 when the name has no letters or numbers', async () => {
    const { service } = createFixture();

    await expect(service.importTeams(input('---'))).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reuses groups that already exist instead of planning them again', async () => {
    const { service, saveAll, listGroups } = createFixture();
    listGroups.mockResolvedValue([{ name: 'A' }]);

    await service.importTeams(input('Um'));

    expect(savedPlan(saveAll).groups).toEqual([]);
  });

  it('does not import into a category that does not exist', async () => {
    const { service, saveAll, listGroups } = createFixture();
    listGroups.mockRejectedValue(new NotFoundException());

    await expect(service.importTeams(input('Um'))).rejects.toBeInstanceOf(NotFoundException);
    expect(saveAll).not.toHaveBeenCalled();
  });
});
