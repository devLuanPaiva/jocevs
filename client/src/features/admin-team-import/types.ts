export type ImportSport = 'FUTSAL' | 'HANDBALL';

export interface ImportCategory {
  id: string;
  sport: ImportSport;
  name: string;
}

export interface ImportDraft {
  key: string;
  categoryId: string | null;
  sport: string;
  categoryName: string;
  group: string;
  name: string;
  city: string;
  abbreviation: string;
}

export type EditableDraftField = 'group' | 'name' | 'city' | 'abbreviation';

export interface DraftChange {
  field: EditableDraftField;
  value: string;
}

export interface ImportRowPayload {
  categoryId: string;
  group: string;
  name: string;
  city: string;
  abbreviation?: string;
}

export interface CategorySection {
  key: string;
  title: string;
  groupCount: number;
  drafts: ImportDraft[];
}

export type CsvParseResult = { ok: true; drafts: ImportDraft[] } | { ok: false; message: string };
