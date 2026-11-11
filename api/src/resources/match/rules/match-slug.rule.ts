import { slugify } from '../../../common/text/slugify';

const VERSUS = 'x';
const SEPARATOR = '-';
const FIRST_SUFFIX = 2;

export interface MatchSlugParts {
  teamAName: string;
  teamBName: string;
  categoryName: string;
  categoryGender: string;
}

const GENDER_LABELS: Record<string, string> = { MALE: 'masculino', FEMALE: 'feminino' };

function categoryPart({ categoryName, categoryGender }: MatchSlugParts): string {
  const name = slugify(categoryName);
  const gender = GENDER_LABELS[categoryGender] ?? slugify(categoryGender);
  return name.includes(gender) ? name : [name, gender].join(SEPARATOR);
}

export function buildMatchSlugBase(parts: MatchSlugParts): string {
  return [slugify(parts.teamAName), VERSUS, slugify(parts.teamBName), categoryPart(parts)].join(
    SEPARATOR,
  );
}

export function pickAvailableSlug(base: string, takenSlugs: readonly string[]): string {
  const taken = new Set(takenSlugs);
  let suffix = FIRST_SUFFIX;
  let candidate = base;
  while (taken.has(candidate)) {
    candidate = `${base}${SEPARATOR}${suffix}`;
    suffix += 1;
  }
  return candidate;
}
