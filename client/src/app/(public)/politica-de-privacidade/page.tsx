import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { LegalPage } from '@/features/legal/components/LegalPage';
import {
  LEGAL_UPDATED_AT,
  LEGAL_UPDATED_AT_LABEL,
  PRIVACY_POLICY_PATH,
} from '@/features/legal/data/legal-metadata';
import { privacyPolicySections } from '@/features/legal/data/privacy-policy';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description:
    'Saiba quais dados pessoais o site da JOCEV’S trata, para quê, e como exercer seus direitos pela LGPD.',
  alternates: { canonical: PRIVACY_POLICY_PATH },
};

export default function PrivacyPolicyRoute(): ReactElement {
  return (
    <LegalPage
      title="Política de privacidade"
      description="Como tratamos os seus dados pessoais e quais são os seus direitos."
      updatedAt={LEGAL_UPDATED_AT}
      updatedAtLabel={LEGAL_UPDATED_AT_LABEL}
      sections={privacyPolicySections}
    />
  );
}
