import type { ReactElement } from 'react';
import type { DraftProblems } from '../lib/team-import-drafts';
import type { CategorySection, DraftChange } from '../types';
import { TeamImportRowFields } from './TeamImportRowFields';

interface TeamImportCategorySectionProps {
  section: CategorySection;
  problems: DraftProblems;
  failedKey: string | null;
  onChange: (key: string, change: DraftChange) => void;
  onRemove: (key: string) => void;
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function TeamImportCategorySection({
  section,
  problems,
  failedKey,
  onChange,
  onRemove,
}: Readonly<TeamImportCategorySectionProps>): ReactElement {
  return (
    <section
      aria-label={section.title}
      className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface"
    >
      <h2 className="border-b border-admin-line bg-admin-canvas px-4 py-2 text-xs font-bold uppercase tracking-wide text-admin-muted">
        {section.title} · {pluralize(section.groupCount, 'grupo', 'grupos')} ·{' '}
        {pluralize(section.drafts.length, 'time', 'times')}
      </h2>
      <ul className="divide-y divide-admin-line">
        {section.drafts.map((draft) => (
          <TeamImportRowFields
            key={draft.key}
            draft={draft}
            problem={problems[draft.key]}
            isFailed={draft.key === failedKey}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </section>
  );
}
