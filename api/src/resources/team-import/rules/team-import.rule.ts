import { slugify } from '../../../common/text/slugify';
import { problem, type RuleProblem } from '../../match/rules/rule-problem';

export interface ImportRow {
  categoryId: string;
  group: string;
  name: string;
  city: string;
  abbreviation?: string;
}

export interface ExistingCategoryData {
  categoryId: string;
  groupNames: string[];
  teamNames: string[];
  teamSlugs: string[];
}

export interface PlannedGroup {
  categoryId: string;
  name: string;
}

export interface PlannedTeam {
  categoryId: string;
  groupName: string;
  name: string;
  slug: string;
  city: string;
  abbreviation: string | null;
}

export interface ImportPlan {
  groups: PlannedGroup[];
  teams: PlannedTeam[];
}

export interface RowProblem extends RuleProblem {
  row: number;
}

export type ImportPlanResult =
  { plan: ImportPlan; problem: null } | { plan: null; problem: RowProblem };

export const TEAM_NAME_INVALID = 'TEAM_NAME_INVALID';

interface CategoryState {
  groupNames: Set<string>;
  teamNames: Set<string>;
  teamSlugs: Set<string>;
}

interface PlanningContext {
  states: Map<string, CategoryState>;
  plan: ImportPlan;
}

function toState(existing: ExistingCategoryData): CategoryState {
  return {
    groupNames: new Set(existing.groupNames),
    teamNames: new Set(existing.teamNames),
    teamSlugs: new Set(existing.teamSlugs),
  };
}

function obtainState(states: Map<string, CategoryState>, categoryId: string): CategoryState {
  const known = states.get(categoryId);
  if (known) {
    return known;
  }
  const created = toState({ categoryId, groupNames: [], teamNames: [], teamSlugs: [] });
  states.set(categoryId, created);
  return created;
}

function findTeamProblem(row: ImportRow, slug: string, state: CategoryState): RuleProblem | null {
  if (!slug) {
    return problem(TEAM_NAME_INVALID, 'O nome do time precisa ter letras ou números.', 'name');
  }
  if (state.teamNames.has(row.name)) {
    return problem('TEAM_NAME_TAKEN', 'Já existe um time com este nome na categoria.', 'name');
  }
  return state.teamSlugs.has(slug)
    ? problem('TEAM_SLUG_TAKEN', 'Já existe um time com um nome equivalente na categoria.', 'name')
    : null;
}

function registerGroup(row: ImportRow, state: CategoryState, plan: ImportPlan): void {
  if (!state.groupNames.has(row.group)) {
    state.groupNames.add(row.group);
    plan.groups.push({ categoryId: row.categoryId, name: row.group });
  }
}

function registerTeam(row: ImportRow, slug: string, context: PlanningContext): void {
  const state = obtainState(context.states, row.categoryId);
  state.teamNames.add(row.name);
  state.teamSlugs.add(slug);
  registerGroup(row, state, context.plan);
  context.plan.teams.push({
    categoryId: row.categoryId,
    groupName: row.group,
    name: row.name,
    slug,
    city: row.city,
    abbreviation: row.abbreviation ?? null,
  });
}

function planRow(row: ImportRow, rowNumber: number, context: PlanningContext): RowProblem | null {
  const slug = slugify(row.name);
  const found = findTeamProblem(row, slug, obtainState(context.states, row.categoryId));
  if (found) {
    return { ...found, row: rowNumber };
  }
  registerTeam(row, slug, context);
  return null;
}

export function planTeamImport(
  rows: ImportRow[],
  existing: ExistingCategoryData[],
): ImportPlanResult {
  const context: PlanningContext = {
    states: new Map(existing.map((data) => [data.categoryId, toState(data)])),
    plan: { groups: [], teams: [] },
  };
  for (const [index, row] of rows.entries()) {
    const found = planRow(row, index + 1, context);
    if (found) {
      return { plan: null, problem: found };
    }
  }
  return { plan: context.plan, problem: null };
}
