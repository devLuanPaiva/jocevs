import type { ReactElement } from 'react';

const COLUMNS = [
  ['sport', 'FUTSAL ou HANDBALL'],
  ['category', 'Nome da categoria, como está cadastrada (ex.: Sub-13, Cadete Feminino)'],
  ['group', 'Só a letra ou o código do grupo (ex.: A, B, U). O painel escreve "Grupo" na frente'],
  ['name', 'Nome do time, sem a cidade'],
  ['city', 'Cidade do time'],
  ['abbreviation', 'Sigla de 2 a 10 letras (opcional)'],
];

export function TeamImportFormatHelp(): ReactElement {
  return (
    <details className="rounded-2xl border border-admin-line bg-admin-surface p-4 text-sm">
      <summary className="min-h-11 cursor-pointer font-semibold">Formato do arquivo</summary>
      <p className="mt-2 text-admin-muted">
        Primeira linha com os nomes das colunas, separadas por vírgula ou ponto e vírgula. Os grupos
        que ainda não existem são criados e os que já existem são reaproveitados. Nada é salvo antes
        de você confirmar e, se algum time falhar, nenhum é cadastrado.
      </p>
      <dl className="mt-3 grid gap-2 sm:grid-cols-[10rem_1fr]">
        {COLUMNS.map(([column, description]) => (
          <div key={column} className="contents">
            <dt className="font-mono font-semibold">{column}</dt>
            <dd className="text-admin-muted">{description}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
