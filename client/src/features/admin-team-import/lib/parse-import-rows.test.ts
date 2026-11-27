import { describe, expect, it } from 'vitest';
import { parseImportRows } from './parse-import-rows';

describe('parseImportRows', () => {
  it('returns the rows sent by the form', () => {
    expect(parseImportRows('[{"name":"Time"}]')).toEqual([{ name: 'Time' }]);
  });

  it.each([['not json'], ['{"name":"Time"}'], ['']])(
    'refuses %j so the action can ask for the file again',
    (serialized) => {
      expect(parseImportRows(serialized)).toBeNull();
    },
  );
});
