import { CookiePreferences } from '@/components/analytics/CookiePreferences';
import { CookieTable } from '../components/CookieTable';
import type { LegalSection } from '../types';

export const cookiePolicySections: LegalSection[] = [
  {
    id: 'o-que-sao',
    heading: 'O que são cookies',
    paragraphs: [
      'Cookies são pequenos arquivos que o site guarda no seu navegador. Usamos o mesmo termo para tecnologias parecidas, como o armazenamento local (localStorage), que lembram escolhas e ajudam a medir o uso do site.',
    ],
  },
  {
    id: 'como-usamos',
    heading: 'Como usamos',
    paragraphs: ['Dividimos o que usamos em duas categorias:'],
    items: [
      'Essenciais: necessários para o site funcionar e lembrar a sua escolha sobre cookies. Não podem ser desativados.',
      'De medição: Google Analytics, via Google Tag Manager, que mostra de forma agregada como o site é usado. Só são ativados se você aceitar.',
    ],
  },
  {
    id: 'lista',
    heading: 'Lista do que armazenamos',
    paragraphs: ['Os nomes podem mudar com atualizações do Google.'],
    extra: <CookieTable />,
  },
  {
    id: 'sua-escolha',
    heading: 'Sua escolha',
    paragraphs: [
      'Você pode aceitar ou recusar os cookies de medição aqui e mudar de ideia quando quiser. Recusar não afeta nenhuma função do site.',
    ],
    extra: <CookiePreferences />,
  },
  {
    id: 'navegador',
    heading: 'Pelo navegador',
    paragraphs: [
      'Você também pode apagar ou bloquear cookies nas configurações do seu navegador. Ao apagar o armazenamento do site, a pergunta sobre cookies volta a aparecer.',
    ],
  },
];
