import { describe, expect, it } from 'vitest';
import { parseCsv } from './csv';

describe('parseCsv', () => {
  it('reads a header and rows separated by commas, ignoring blank lines', () => {
    expect(parseCsv('a,b\n1,2\n\n3,4\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
      ['3', '4'],
    ]);
  });

  it('keeps commas, doubled quotes and line breaks that are inside quotes', () => {
    expect(parseCsv('name,city\n"Silva, João","Pau ""dos"" Ferros"\n')).toEqual([
      ['name', 'city'],
      ['Silva, João', 'Pau "dos" Ferros'],
    ]);
  });

  it('reads files saved by Excel in pt-BR: semicolons, CRLF and byte order mark', () => {
    expect(parseCsv('﻿name;city\r\nViçosa Futsal;Viçosa\r\n')).toEqual([
      ['name', 'city'],
      ['Viçosa Futsal', 'Viçosa'],
    ]);
  });

  it('keeps the last row when the file has no trailing line break', () => {
    expect(parseCsv('a,b\n1,2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('keeps empty fields so the columns stay aligned', () => {
    expect(parseCsv('a,b,c\n1,,3\n')[1]).toEqual(['1', '', '3']);
  });
});
