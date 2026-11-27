export function parseImportRows(serialized: string): unknown[] | null {
  try {
    const parsed: unknown = JSON.parse(serialized);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
