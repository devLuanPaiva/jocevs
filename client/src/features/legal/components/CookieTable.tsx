import type { ReactElement } from 'react';
import { CONSENT_STORAGE_KEY } from '@/lib/analytics/consent';

interface CookieRow {
  name: string;
  category: string;
  purpose: string;
  duration: string;
}

const COOKIE_ROWS: CookieRow[] = [
  {
    name: CONSENT_STORAGE_KEY,
    category: 'Essencial',
    purpose: 'Guarda a sua escolha sobre cookies de medição.',
    duration: 'Até você apagar',
  },
  {
    name: '_ga e _ga_*',
    category: 'Medição',
    purpose: 'Distingue visitantes e sessões de forma anônima no Google Analytics.',
    duration: 'Até 2 anos',
  },
  {
    name: 'Cache do aplicativo (service worker)',
    category: 'Essencial',
    purpose: 'Permite instalar o site como aplicativo e abrir a página offline.',
    duration: 'Até você apagar',
  },
];

const HEADERS = ['Nome', 'Categoria', 'Finalidade', 'Duração'];

const cellClassName = 'border-b border-ink/15 px-3 py-3 text-left align-top';

export function CookieTable(): ReactElement {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-xl text-sm">
        <caption className="sr-only">Cookies e armazenamentos usados pelo site</caption>
        <thead>
          <tr>
            {HEADERS.map((header) => (
              <th key={header} scope="col" className={cellClassName}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COOKIE_ROWS.map((row) => (
            <tr key={row.name}>
              <th scope="row" className={`${cellClassName} font-medium`}>
                {row.name}
              </th>
              <td className={cellClassName}>{row.category}</td>
              <td className={cellClassName}>{row.purpose}</td>
              <td className={cellClassName}>{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
