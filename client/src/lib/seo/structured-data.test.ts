import { describe, expect, it } from 'vitest';
import { serializeStructuredData } from './structured-data';

describe('serializeStructuredData', () => {
  it('escapes markup so the JSON cannot close the script tag', () => {
    const serialized = serializeStructuredData({ name: '</script><script>alert(1)</script>' });

    expect(serialized).not.toContain('<');
    expect(JSON.parse(serialized)).toEqual({ name: '</script><script>alert(1)</script>' });
  });
});
