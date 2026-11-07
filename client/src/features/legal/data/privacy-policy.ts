import type { LegalSection } from '../types';
import { CONTROLLER_NAME } from './legal-metadata';

export const privacyPolicySections: LegalSection[] = [
  {
    id: 'quem-somos',
    heading: 'Quem somos',
    paragraphs: [
      `Este site é mantido pela ${CONTROLLER_NAME}, por meio da Secretaria de Cultura, Turismo, Esporte e Lazer, e divulga a JOCEV’S: jogos, placares, fotos, programação e a história da festividade de emancipação política de Viçosa/RN.`,
      'Esta política explica quais dados pessoais tratamos, para quê e quais são os seus direitos, em linha com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).',
    ],
  },
  {
    id: 'dados-que-coletamos',
    heading: 'Quais dados coletamos',
    paragraphs: ['Navegar pelo site não exige cadastro. Os dados tratados são:'],
    items: [
      'Dados de navegação, como páginas visitadas, tipo de dispositivo, navegador, idioma e origem do acesso, coletados de forma agregada pelo Google Analytics, somente se você aceitar os cookies de medição.',
      'Dados técnicos de acesso, como endereço IP e data e hora da requisição, registrados pelos servidores por segurança e para o funcionamento do site.',
      'Imagens de participantes e público publicadas na galeria de fotos dos eventos.',
      'Dados de login (nome, e-mail e foto do perfil Google) de integrantes da organização que acessam o painel administrativo. Visitantes não usam o painel.',
    ],
  },
  {
    id: 'finalidades',
    heading: 'Para que usamos os dados',
    paragraphs: ['Usamos os dados para:'],
    items: [
      'entender quais conteúdos são mais acessados e melhorar o site (medição de audiência);',
      'manter o site seguro, estável e disponível, inclusive prevenindo abusos;',
      'divulgar e registrar a memória da festividade por meio de fotos e resultados;',
      'controlar o acesso de quem administra o conteúdo do site.',
    ],
  },
  {
    id: 'bases-legais',
    heading: 'Bases legais',
    paragraphs: [
      'A medição de audiência só acontece com o seu consentimento (art. 7º, I, da LGPD), que você pode recusar ou revogar a qualquer momento. Os dados técnicos de segurança se baseiam no legítimo interesse e no cumprimento de obrigação legal (art. 7º, II e IX). A divulgação de fotos e resultados cumpre a finalidade pública de promoção da cultura e do esporte do município.',
    ],
  },
  {
    id: 'compartilhamento',
    heading: 'Com quem compartilhamos',
    paragraphs: [
      'Não vendemos dados pessoais. Os dados de medição são processados pelo Google (Google Analytics e Google Tag Manager), que pode armazená-los em servidores fora do Brasil, conforme as garantias de transferência internacional previstas na LGPD. Também usamos provedores de hospedagem e de armazenamento de imagens para manter o site no ar.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies',
    paragraphs: [
      'Usamos cookies e armazenamento local no seu navegador. Os detalhes, inclusive como mudar a sua escolha, estão na política de cookies.',
    ],
  },
  {
    id: 'retencao',
    heading: 'Por quanto tempo guardamos',
    paragraphs: [
      'Guardamos os dados apenas pelo tempo necessário às finalidades acima. Os dados de medição seguem o período de retenção configurado no Google Analytics. Fotos permanecem na galeria enquanto forem relevantes para a memória da festividade e podem ser removidas a seu pedido.',
    ],
  },
  {
    id: 'seus-direitos',
    heading: 'Seus direitos',
    paragraphs: ['Você pode, a qualquer momento, pedir:'],
    items: [
      'confirmação de que tratamos seus dados e acesso a eles;',
      'correção de dados incompletos ou desatualizados;',
      'anonimização, bloqueio ou eliminação de dados desnecessários;',
      'revogação do consentimento, sem prejuízo do tratamento já feito;',
      'remoção de uma foto sua da galeria;',
      'informações sobre com quem compartilhamos seus dados.',
    ],
  },
  {
    id: 'contato',
    heading: 'Como falar conosco',
    paragraphs: [
      `Para exercer seus direitos ou tirar dúvidas, procure a Secretaria de Cultura, Turismo, Esporte e Lazer da ${CONTROLLER_NAME} pelos canais oficiais da Prefeitura. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).`,
    ],
  },
  {
    id: 'alteracoes',
    heading: 'Alterações nesta política',
    paragraphs: [
      'Podemos atualizar esta política para refletir mudanças no site ou na lei. A data da última atualização aparece no topo desta página.',
    ],
  },
];
