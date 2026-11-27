'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { ADMIN_CATEGORIES_PATH } from '@/features/admin-shell/lib/admin-sections';
import { useTeamImport } from '../hooks/use-team-import';
import type { ImportCategory } from '../types';
import { TeamImportCategorySection } from './TeamImportCategorySection';
import { TeamImportFilePicker } from './TeamImportFilePicker';

interface TeamImportFormProps {
  categories: ImportCategory[];
}

function ErrorMessage({ text }: { text: string }): ReactElement {
  return (
    <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
      {text}
    </p>
  );
}

export function TeamImportForm({ categories }: Readonly<TeamImportFormProps>): ReactElement {
  const controls = useTeamImport(categories);
  const hasProblems = Object.keys(controls.problems).length > 0;

  return (
    <form action={controls.formAction} className="flex flex-col gap-5">
      <TeamImportFilePicker message={controls.fileMessage} onFile={controls.loadFile} />
      {controls.sections.map((section) => (
        <TeamImportCategorySection
          key={section.key}
          section={section}
          problems={controls.problems}
          failedKey={controls.failedKey}
          onChange={controls.changeDraft}
          onRemove={controls.removeRow}
        />
      ))}
      <input type="hidden" name="rows" value={controls.payload} />
      {hasProblems ? (
        <ErrorMessage text="Corrija ou remova as linhas destacadas para continuar." />
      ) : null}
      {controls.state.errorMessage ? <ErrorMessage text={controls.state.errorMessage} /> : null}
      <div className="sticky bottom-0 flex gap-3 border-t border-admin-line bg-admin-canvas py-3">
        <Link
          href={ADMIN_CATEGORIES_PATH}
          className="inline-flex min-h-12 items-center rounded-xl border border-admin-line bg-admin-surface px-6 font-semibold hover:border-brand-500"
        >
          Cancelar
        </Link>
        <SubmitButton
          pendingLabel="Cadastrando…"
          className="min-h-12 flex-1 px-6"
          disabled={!controls.canSubmit}
        >
          Cadastrar {controls.drafts.length} times
        </SubmitButton>
      </div>
    </form>
  );
}
