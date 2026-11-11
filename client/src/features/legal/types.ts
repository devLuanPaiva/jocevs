import type { ReactNode } from 'react';

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs: string[];
  items?: string[];
  extra?: ReactNode;
}
