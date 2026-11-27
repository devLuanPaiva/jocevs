import { MAX_ABBREVIATION_LENGTH, MIN_ABBREVIATION_LENGTH } from './team-import-limits';
import type { CategorySection, DraftChange, ImportDraft, ImportRowPayload } from '../types';

const ROW_FIELD_PATTERN = /^rows\.(\d+)\./;

export type DraftProblems = Record<string, string>;

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase('pt-BR');
}

const SPORT_LABELS: Record<string, string> = { FUTSAL: 'Futsal', HANDBALL: 'Handebol' };

function categoryTitle(draft: ImportDraft): string {
  return `${SPORT_LABELS[draft.sport] ?? draft.sport} · ${draft.categoryName}`;
}

function hasValidAbbreviation(abbreviation: string): boolean {
  return (
    abbreviation === '' ||
    (abbreviation.length >= MIN_ABBREVIATION_LENGTH &&
      abbreviation.length <= MAX_ABBREVIATION_LENGTH)
  );
}

function findRequiredFieldProblem(draft: ImportDraft): string | null {
  if (draft.categoryId === null) {
    return `Categoria não encontrada: ${categoryTitle(draft)}. Remova a linha ou corrija o arquivo.`;
  }
  if (draft.group === '') {
    return 'Informe o grupo.';
  }
  if (draft.name === '') {
    return 'Informe o nome do time.';
  }
  return draft.city === '' ? 'Informe a cidade.' : null;
}

function findDraftProblem(draft: ImportDraft): string | null {
  return hasValidAbbreviation(draft.abbreviation)
    ? findRequiredFieldProblem(draft)
    : 'A abreviação deve ter de 2 a 10 caracteres.';
}

function findDuplicateKeys(drafts: ImportDraft[]): Set<string> {
  const seen = new Set<string>();
  const duplicated = new Set<string>();
  for (const draft of drafts) {
    const identity = `${draft.categoryId}:${normalizeName(draft.name)}`;
    if (seen.has(identity)) {
      duplicated.add(draft.key);
    } else {
      seen.add(identity);
    }
  }
  return duplicated;
}

export function findDraftProblems(drafts: ImportDraft[]): DraftProblems {
  const duplicated = findDuplicateKeys(drafts);
  const problems: DraftProblems = {};
  for (const draft of drafts) {
    const problem = findDraftProblem(draft);
    if (problem) {
      problems[draft.key] = problem;
    } else if (duplicated.has(draft.key)) {
      problems[draft.key] = 'Já existe um time com este nome na categoria, neste arquivo.';
    }
  }
  return problems;
}

export function updateDraft(
  drafts: ImportDraft[],
  key: string,
  { field, value }: DraftChange,
): ImportDraft[] {
  const normalized = field === 'abbreviation' ? value.toUpperCase() : value;
  return drafts.map((draft) => (draft.key === key ? { ...draft, [field]: normalized } : draft));
}

export function removeDraft(drafts: ImportDraft[], key: string): ImportDraft[] {
  return drafts.filter((draft) => draft.key !== key);
}

export function toImportPayload(drafts: ImportDraft[]): ImportRowPayload[] {
  return drafts.flatMap((draft) =>
    draft.categoryId === null
      ? []
      : [
          {
            categoryId: draft.categoryId,
            group: draft.group.trim(),
            name: draft.name.trim(),
            city: draft.city.trim(),
            ...(draft.abbreviation.trim() && { abbreviation: draft.abbreviation.trim() }),
          },
        ],
  );
}

export function groupDraftsByCategory(drafts: ImportDraft[]): CategorySection[] {
  const sections = new Map<string, ImportDraft[]>();
  for (const draft of drafts) {
    const key = categoryTitle(draft);
    sections.set(key, [...(sections.get(key) ?? []), draft]);
  }
  return [...sections].map(([key, sectionDrafts]) => ({
    key,
    title: key,
    groupCount: new Set(sectionDrafts.map((draft) => draft.group.trim())).size,
    drafts: sectionDrafts,
  }));
}

export function findFailedDraftKey(
  drafts: ImportDraft[],
  errorField: string | null,
): string | null {
  const index = Number(ROW_FIELD_PATTERN.exec(errorField ?? '')?.[1]);
  const payloadKeys = drafts.filter((draft) => draft.categoryId !== null).map((draft) => draft.key);
  return payloadKeys[index] ?? null;
}
