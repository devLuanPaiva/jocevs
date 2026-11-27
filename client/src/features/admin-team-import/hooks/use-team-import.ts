import { useActionState, useState } from 'react';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { importTeamsAction } from '../actions/team-import-actions';
import { parseTeamImportCsv } from '../lib/team-import-csv';
import {
  findDraftProblems,
  findFailedDraftKey,
  groupDraftsByCategory,
  removeDraft,
  toImportPayload,
  updateDraft,
  type DraftProblems,
} from '../lib/team-import-drafts';
import type { CategorySection, DraftChange, ImportCategory, ImportDraft } from '../types';

interface TeamImportControls {
  state: FormErrorState;
  formAction: (formData: FormData) => void;
  drafts: ImportDraft[];
  sections: CategorySection[];
  problems: DraftProblems;
  failedKey: string | null;
  fileMessage: string | null;
  payload: string;
  canSubmit: boolean;
  loadFile: (file: File) => Promise<void>;
  changeDraft: (key: string, change: DraftChange) => void;
  removeRow: (key: string) => void;
}

export function useTeamImport(categories: ImportCategory[]): TeamImportControls {
  const [state, formAction] = useActionState(importTeamsAction, INITIAL_FORM_ERROR_STATE);
  const [drafts, setDrafts] = useState<ImportDraft[]>([]);
  const [fileMessage, setFileMessage] = useState<string | null>(null);
  const problems = findDraftProblems(drafts);

  const loadFile = async (file: File): Promise<void> => {
    const result = parseTeamImportCsv(await file.text(), categories);
    setFileMessage(result.ok ? null : result.message);
    setDrafts(result.ok ? result.drafts : []);
  };

  return {
    state,
    formAction,
    drafts,
    sections: groupDraftsByCategory(drafts),
    problems,
    failedKey: findFailedDraftKey(drafts, state.errorField),
    fileMessage,
    payload: JSON.stringify(toImportPayload(drafts)),
    canSubmit: drafts.length > 0 && Object.keys(problems).length === 0,
    loadFile,
    changeDraft: (key, change) => setDrafts((current) => updateDraft(current, key, change)),
    removeRow: (key) => setDrafts((current) => removeDraft(current, key)),
  };
}
