import Link from 'next/link';
import type { ReactElement } from 'react';
import { TEAM_IMPORT_PATH } from '@/features/admin-team-import/lib/team-import-paths';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { getAdminCategories } from '../services/get-admin-categories';
import { CategorySearchList } from './CategorySearchList';

export async function AdminCategoriesLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'team:manage')) {
    return <NoPermission action="gerir categorias, grupos e times" />;
  }
  return (
    <>
      <Link
        href={TEAM_IMPORT_PATH}
        className="inline-flex min-h-12 items-center self-start rounded-xl border border-admin-line bg-admin-surface px-6 font-semibold hover:border-brand-500"
      >
        Importar times de um CSV
      </Link>
      <CategorySearchList modalities={await getAdminCategories()} />
    </>
  );
}
