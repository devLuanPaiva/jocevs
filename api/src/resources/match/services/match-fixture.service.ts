import { Injectable } from '@nestjs/common';
import type { FixtureShape } from '../rules/fixture.rule';
import { MatchFixtureValidator } from './match-fixture-validator.service';
import { MatchSlugService, type SlugFixture } from './match-slug.service';

@Injectable()
export class MatchFixtureService {
  public constructor(
    private readonly validator: MatchFixtureValidator,
    private readonly slugService: MatchSlugService,
  ) {}

  public assertValid(categoryId: string, fixture: FixtureShape): Promise<void> {
    return this.validator.assertValid(categoryId, fixture);
  }

  public assignSlug(categoryId: string, fixture: SlugFixture): Promise<string> {
    return this.slugService.assignOne(categoryId, fixture);
  }

  public assignSlugs<T extends SlugFixture>(
    categoryId: string,
    fixtures: T[],
  ): Promise<(T & { slug: string })[]> {
    return this.slugService.assignMany(categoryId, fixtures);
  }
}
