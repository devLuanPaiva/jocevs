import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { getImportCategories } from '../services/get-import-categories';
import { TeamImportForm } from './TeamImportForm';
import { TeamImportFormatHelp } from './TeamImportFormatHelp';

export async function TeamImportLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'team:manage')) {
    return <NoPermission action="gerir categorias, grupos e times" />;
  }
  return (
    <>
      <TeamImportFormatHelp />
      <TeamImportForm categories={await getImportCategories()} />
    </>
  );
}
