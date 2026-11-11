import { Injectable } from '@nestjs/common';
import type { Category } from '../../category/entities/category.entity';
import { CategoryService } from '../../category/services/category.service';
import { TeamService } from '../../team/services/team.service';
import { MatchRepository } from '../repository/match.repository';
import { buildMatchSlugBase, pickAvailableSlug } from '../rules/match-slug.rule';

export interface SlugFixture {
  teamAId: string;
  teamBId: string;
}

interface SlugContext {
  category: Category;
  teamNames: Map<string, string>;
}

@Injectable()
export class MatchSlugService {
  public constructor(
    private readonly matchRepository: MatchRepository,
    private readonly categoryService: CategoryService,
    private readonly teamService: TeamService,
  ) {}

  public async assignOne(categoryId: string, fixture: SlugFixture): Promise<string> {
    const context = await this.loadContext(categoryId, [fixture]);
    const base = this.baseFor(context, fixture);
    return pickAvailableSlug(base, await this.matchRepository.findSlugsStartingWith([base]));
  }

  public async assignMany<T extends SlugFixture>(
    categoryId: string,
    fixtures: T[],
  ): Promise<(T & { slug: string })[]> {
    const context = await this.loadContext(categoryId, fixtures);
    const bases = fixtures.map((fixture) => this.baseFor(context, fixture));
    const taken = await this.matchRepository.findSlugsStartingWith(bases);
    return fixtures.map((fixture, index) => {
      const slug = pickAvailableSlug(bases[index] ?? '', taken);
      taken.push(slug);
      return { ...fixture, slug };
    });
  }

  private async loadContext(categoryId: string, fixtures: SlugFixture[]): Promise<SlugContext> {
    const category = await this.categoryService.findByIdOrFail(categoryId);
    const teams = await this.teamService.listByIds(
      fixtures.flatMap(({ teamAId, teamBId }) => [teamAId, teamBId]),
    );
    return { category, teamNames: new Map(teams.map((team) => [team.id, team.name])) };
  }

  private baseFor({ category, teamNames }: SlugContext, fixture: SlugFixture): string {
    return buildMatchSlugBase({
      teamAName: teamNames.get(fixture.teamAId) ?? '',
      teamBName: teamNames.get(fixture.teamBId) ?? '',
      categoryName: category.name,
      categoryGender: category.gender,
    });
  }
}
