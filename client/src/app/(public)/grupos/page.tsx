import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import type { SearchParams } from '@/features/games/lib/game-filters';
import { GroupsPage } from '@/features/groups/GroupsPage';

export const metadata: Metadata = {
  title: 'Grupos e classificação',
  description:
    'Grupos, times, classificação e chaveamento do futsal e do handebol da JOCEV’S 2026.',
};

interface GroupsRouteProps {
  searchParams: Promise<SearchParams>;
}

export default function GroupsRoute({ searchParams }: Readonly<GroupsRouteProps>): ReactElement {
  return <GroupsPage searchParams={searchParams} />;
}
