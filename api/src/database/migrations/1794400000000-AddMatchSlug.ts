import type { MigrationInterface, QueryRunner } from 'typeorm';
import { buildMatchSlugBase, pickAvailableSlug } from '../../resources/match/rules/match-slug.rule';

interface MatchSlugSource {
  id: string;
  teamAName: string;
  teamBName: string;
  categoryName: string;
  categoryGender: string;
}

const ADD_COLUMN = `ALTER TABLE match ADD COLUMN slug varchar`;

const SELECT_SOURCES = `
  SELECT m.id,
         team_a.name AS "teamAName",
         team_b.name AS "teamBName",
         category.name AS "categoryName",
         category.gender AS "categoryGender"
  FROM match m
  JOIN team team_a ON team_a.id = m.team_a_id
  JOIN team team_b ON team_b.id = m.team_b_id
  JOIN category ON category.id = m.category_id
  ORDER BY m.scheduled_at, m.id
`;

const UPDATE_SLUG = `UPDATE match SET slug = $1 WHERE id = $2`;
const REQUIRE_SLUG = `ALTER TABLE match ALTER COLUMN slug SET NOT NULL`;
const UNIQUE_SLUG = `CREATE UNIQUE INDEX match_slug_unique ON match (slug)`;
const DROP_UNIQUE_SLUG = `DROP INDEX match_slug_unique`;
const DROP_COLUMN = `ALTER TABLE match DROP COLUMN slug`;

export class AddMatchSlug1794400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(ADD_COLUMN);
    const sources = (await queryRunner.query(SELECT_SOURCES)) as MatchSlugSource[];
    const taken: string[] = [];
    for (const source of sources) {
      const slug = pickAvailableSlug(buildMatchSlugBase(source), taken);
      taken.push(slug);
      await queryRunner.query(UPDATE_SLUG, [slug, source.id]);
    }
    await queryRunner.query(REQUIRE_SLUG);
    await queryRunner.query(UNIQUE_SLUG);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(DROP_UNIQUE_SLUG);
    await queryRunner.query(DROP_COLUMN);
  }
}
