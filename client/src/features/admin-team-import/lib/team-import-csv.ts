import { parseCsv } from './csv';
import { MAX_IMPORT_TEAMS } from './team-import-limits';
import type { CsvParseResult, ImportCategory, ImportDraft } from '../types';

const REQUIRED_COLUMNS = ['sport', 'category', 'group', 'name', 'city'];

type ColumnIndexes = Record<string, number>;

function normalize(text: string): string {
  return text.trim().toLocaleLowerCase('pt-BR');
}

function indexColumns(header: string[]): ColumnIndexes {
  return Object.fromEntries(header.map((column, index) => [normalize(column), index]));
}

function findMissingColumns(indexes: ColumnIndexes): string[] {
  return REQUIRED_COLUMNS.filter((column) => indexes[column] === undefined);
}

function readCell(cells: string[], indexes: ColumnIndexes, column: string): string {
  const index = indexes[column];
  return index === undefined ? '' : (cells[index] ?? '').trim();
}

function findCategoryId(
  categories: ImportCategory[],
  sport: string,
  categoryName: string,
): string | null {
  const found = categories.find(
    (category) =>
      normalize(category.sport) === normalize(sport) &&
      normalize(category.name) === normalize(categoryName),
  );
  return found?.id ?? null;
}

function toDraft(
  cells: string[],
  index: number,
  context: { indexes: ColumnIndexes; categories: ImportCategory[] },
): ImportDraft {
  const read = (column: string): string => readCell(cells, context.indexes, column);
  return {
    key: `row-${index}`,
    categoryId: findCategoryId(context.categories, read('sport'), read('category')),
    sport: read('sport').toUpperCase(),
    categoryName: read('category'),
    group: read('group'),
    name: read('name'),
    city: read('city'),
    abbreviation: read('abbreviation').toUpperCase(),
  };
}

export function parseTeamImportCsv(text: string, categories: ImportCategory[]): CsvParseResult {
  const [header, ...lines] = parseCsv(text);
  if (!header) {
    return { ok: false, message: 'O arquivo está vazio.' };
  }
  const indexes = indexColumns(header);
  const missing = findMissingColumns(indexes);
  if (missing.length > 0) {
    return { ok: false, message: `Faltam colunas no arquivo: ${missing.join(', ')}.` };
  }
  if (lines.length === 0) {
    return { ok: false, message: 'O arquivo não tem nenhum time.' };
  }
  if (lines.length > MAX_IMPORT_TEAMS) {
    return {
      ok: false,
      message: `O arquivo tem mais de ${MAX_IMPORT_TEAMS} times. Divida em partes.`,
    };
  }
  return {
    ok: true,
    drafts: lines.map((cells, index) => toDraft(cells, index, { indexes, categories })),
  };
}
