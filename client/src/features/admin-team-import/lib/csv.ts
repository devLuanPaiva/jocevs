const QUOTE = '"';
const COMMA = ',';
const SEMICOLON = ';';
const LINE_FEED = '\n';
const CARRIAGE_RETURN = '\r';
const BYTE_ORDER_MARK = '﻿';

interface ParserState {
  delimiter: string;
  rows: string[][];
  row: string[];
  field: string;
  isQuoted: boolean;
}

function detectDelimiter(text: string): string {
  const header = text.split(LINE_FEED, 1)[0] ?? '';
  return header.includes(SEMICOLON) && !header.includes(COMMA) ? SEMICOLON : COMMA;
}

function endField(state: ParserState): void {
  state.row.push(state.field);
  state.field = '';
}

function endRow(state: ParserState): void {
  endField(state);
  state.rows.push(state.row);
  state.row = [];
}

function consumeQuoted(state: ParserState, char: string, next: string | undefined): number {
  if (char !== QUOTE) {
    state.field += char;
    return 1;
  }
  if (next === QUOTE) {
    state.field += QUOTE;
    return 2;
  }
  state.isQuoted = false;
  return 1;
}

function consumePlain(state: ParserState, char: string): void {
  if (char === QUOTE) {
    state.isQuoted = true;
  } else if (char === state.delimiter) {
    endField(state);
  } else if (char === LINE_FEED) {
    endRow(state);
  } else if (char !== CARRIAGE_RETURN) {
    state.field += char;
  }
}

function isBlankRow(row: string[]): boolean {
  return row.every((field) => field.trim() === '');
}

export function parseCsv(text: string): string[][] {
  const content = text.startsWith(BYTE_ORDER_MARK) ? text.slice(1) : text;
  const state: ParserState = {
    delimiter: detectDelimiter(content),
    rows: [],
    row: [],
    field: '',
    isQuoted: false,
  };
  let position = 0;
  while (position < content.length) {
    const char = content.charAt(position);
    if (state.isQuoted) {
      position += consumeQuoted(state, char, content[position + 1]);
    } else {
      consumePlain(state, char);
      position += 1;
    }
  }
  if (state.field !== '' || state.row.length > 0) {
    endRow(state);
  }
  return state.rows.filter((row) => !isBlankRow(row));
}
