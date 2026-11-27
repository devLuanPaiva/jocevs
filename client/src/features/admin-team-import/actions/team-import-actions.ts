'use server';

import { refreshChampionshipData } from '@/features/admin-teams/lib/refresh-championship-data';
import { redirectToSuccess } from '@/features/admin-shell/lib/redirect-to-success';
import { ADMIN_CATEGORIES_PATH } from '@/features/admin-shell/lib/admin-sections';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { readText } from '@/lib/forms/form-data';
import { parseImportRows } from '../lib/parse-import-rows';

const UNREADABLE_ROWS: FormErrorState = {
  errorMessage: 'Não foi possível ler os times do arquivo. Escolha o arquivo novamente.',
  errorField: null,
};

export async function importTeamsAction(
  _previousState: FormErrorState,
  formData: FormData,
): Promise<FormErrorState> {
  const rows = parseImportRows(readText(formData, 'rows'));
  if (!rows) {
    return UNREADABLE_ROWS;
  }
  const failure = await submitAdminRequest('/team-imports', { method: 'POST', body: { rows } });
  if (failure) {
    return failure;
  }
  refreshChampionshipData();
  redirectToSuccess('teams-imported', ADMIN_CATEGORIES_PATH);
}
