import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { LegalPage } from '@/features/legal/components/LegalPage';
import { cookiePolicySections } from '@/features/legal/data/cookie-policy';
import {
  COOKIE_POLICY_PATH,
  LEGAL_UPDATED_AT,
  LEGAL_UPDATED_AT_LABEL,
} from '@/features/legal/data/legal-metadata';

export const metadata: Metadata = {
  title: 'Política de cookies',
  description:
    'Quais cookies o site da JOCEV’S usa, para quê, e como aceitar ou recusar a medição de audiência.',
  alternates: { canonical: COOKIE_POLICY_PATH },
};

export default function CookiePolicyRoute(): ReactElement {
  return (
    <LegalPage
      title="Política de cookies"
      description="O que o site guarda no seu navegador e como você controla isso."
      updatedAt={LEGAL_UPDATED_AT}
      updatedAtLabel={LEGAL_UPDATED_AT_LABEL}
      sections={cookiePolicySections}
    />
  );
}
