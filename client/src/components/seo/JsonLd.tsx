import type { ReactElement } from 'react';
import { serializeStructuredData } from '@/lib/seo/structured-data';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: Readonly<JsonLdProps>): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  );
}
