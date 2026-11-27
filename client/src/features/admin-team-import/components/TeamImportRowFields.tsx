import type { ReactElement } from 'react';
import type { DraftChange, EditableDraftField, ImportDraft } from '../types';

const INPUT_CLASS =
  'min-h-11 w-full rounded-xl border border-admin-line bg-white px-3 text-base font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30';
const NAME_MAX_LENGTH = 120;
const ABBREVIATION_MAX_LENGTH = 10;
const FULL_WIDTH_ON_PHONE = 'col-span-2 sm:col-span-1';

interface FieldSpec {
  label: string;
  field: EditableDraftField;
  maxLength: number;
  className: string;
}

const FIELD_SPECS: FieldSpec[] = [
  { label: 'Grupo', field: 'group', maxLength: NAME_MAX_LENGTH, className: '' },
  {
    label: 'Nome do time',
    field: 'name',
    maxLength: NAME_MAX_LENGTH,
    className: FULL_WIDTH_ON_PHONE,
  },
  { label: 'Cidade', field: 'city', maxLength: NAME_MAX_LENGTH, className: '' },
  { label: 'Sigla', field: 'abbreviation', maxLength: ABBREVIATION_MAX_LENGTH, className: '' },
];

interface TeamImportRowFieldsProps {
  draft: ImportDraft;
  problem: string | undefined;
  isFailed: boolean;
  onChange: (key: string, change: DraftChange) => void;
  onRemove: (key: string) => void;
}

function RowProblem({ text }: { text: string }): ReactElement {
  return (
    <p role="alert" className="text-sm font-semibold text-danger">
      {text}
    </p>
  );
}

export function TeamImportRowFields({
  draft,
  problem,
  isFailed,
  onChange,
  onRemove,
}: Readonly<TeamImportRowFieldsProps>): ReactElement {
  const hasIssue = Boolean(problem) || isFailed;
  return (
    <li className={`flex flex-col gap-2 px-4 py-3 ${hasIssue ? 'bg-danger/5' : ''}`}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[4rem_2fr_1.5fr_6rem_auto] sm:items-end">
        {FIELD_SPECS.map(({ label, field, maxLength, className }) => (
          <label
            key={field}
            className={`flex flex-col gap-1 text-xs font-semibold text-admin-muted ${className}`}
          >
            {label}
            <input
              value={draft[field]}
              maxLength={maxLength}
              autoComplete="off"
              onChange={(event) => onChange(draft.key, { field, value: event.target.value })}
              className={INPUT_CLASS}
            />
          </label>
        ))}
        <button
          type="button"
          onClick={() => onRemove(draft.key)}
          className="col-span-2 min-h-11 rounded-xl border border-admin-line px-4 text-sm font-semibold hover:border-danger hover:text-danger sm:col-span-1"
        >
          Remover
        </button>
      </div>
      {problem ? <RowProblem text={problem} /> : null}
      {isFailed && !problem ? (
        <RowProblem text="A API recusou esta linha. Veja a mensagem no fim da página." />
      ) : null}
    </li>
  );
}
