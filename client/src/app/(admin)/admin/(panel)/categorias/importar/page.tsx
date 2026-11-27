import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { TeamImportLoader } from '@/features/admin-team-import/components/TeamImportLoader';

export const metadata: Metadata = { title: 'Importar times' };

export default function TeamImportRoute(): ReactElement {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Importar times</h1>
        <p className="text-sm text-admin-muted">
          Envie um CSV com os grupos e os times, revise a lista e cadastre tudo de uma vez.
        </p>
      </header>
      <Suspense fallback={<AdminFormSkeleton label="Carregando o formulário de importação" />}>
        <TeamImportLoader />
      </Suspense>
    </>
  );
}
