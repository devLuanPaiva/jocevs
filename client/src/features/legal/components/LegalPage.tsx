import type { ReactElement } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import type { LegalSection } from '../types';

interface LegalPageProps {
  title: string;
  description: string;
  updatedAt: string;
  updatedAtLabel: string;
  sections: LegalSection[];
}

function LegalSectionBlock({ section }: Readonly<{ section: LegalSection }>): ReactElement {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} className="scroll-mt-24 font-display text-3xl">
        {section.heading}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 leading-relaxed">
          {paragraph}
        </p>
      ))}
      {section.items ? (
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.extra}
    </section>
  );
}

export function LegalPage({
  title,
  description,
  updatedAt,
  updatedAtLabel,
  sections,
}: Readonly<LegalPageProps>): ReactElement {
  return (
    <>
      <PageHero eyebrow="JOCEV’S" title={title} description={description} />
      <Section tone="paper" withWave labelledBy="page-title">
        <article className="mx-auto max-w-3xl space-y-10">
          <p className="text-sm text-ink/70">
            Última atualização: <time dateTime={updatedAt}>{updatedAtLabel}</time>
          </p>
          <nav aria-label="Nesta página">
            <ol className="list-decimal space-y-1 pl-5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="underline hover:text-brand-500">
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          {sections.map((section) => (
            <LegalSectionBlock key={section.id} section={section} />
          ))}
        </article>
      </Section>
    </>
  );
}
