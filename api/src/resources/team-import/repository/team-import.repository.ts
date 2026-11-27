import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, type EntityManager } from 'typeorm';
import { MatchGroup } from '../../match-group/entities/match-group.entity';
import { Team } from '../../team/entities/team.entity';
import type { ImportPlan, PlannedGroup } from '../rules/team-import.rule';

export interface TeamImportSummary {
  groupsCreated: number;
  teamsCreated: number;
}

function groupKey(categoryId: string, name: string): string {
  return `${categoryId}:${name}`;
}

async function createGroups(manager: EntityManager, groups: PlannedGroup[]): Promise<void> {
  await manager.save(
    MatchGroup,
    groups.map((group) => manager.create(MatchGroup, group)),
  );
}

async function mapGroupIds(
  manager: EntityManager,
  categoryIds: string[],
): Promise<Map<string, string>> {
  const groups = await manager.find(MatchGroup, { where: { categoryId: In(categoryIds) } });
  return new Map(groups.map((group) => [groupKey(group.categoryId, group.name), group.id]));
}

@Injectable()
export class TeamImportRepository {
  public constructor(@InjectRepository(Team) private readonly repository: Repository<Team>) {}

  public saveAll(plan: ImportPlan): Promise<TeamImportSummary> {
    return this.repository.manager.transaction(async (manager) => {
      await createGroups(manager, plan.groups);
      const categoryIds = [...new Set(plan.teams.map((team) => team.categoryId))];
      const groupIds = await mapGroupIds(manager, categoryIds);
      await manager.save(
        Team,
        plan.teams.map(({ groupName, ...team }) =>
          manager.create(Team, {
            ...team,
            groupId: groupIds.get(groupKey(team.categoryId, groupName)) ?? null,
            photoKey: null,
          }),
        ),
      );
      return { groupsCreated: plan.groups.length, teamsCreated: plan.teams.length };
    });
  }
}
