import type { ParserResult } from '../../types/extraction';
import { parsePdf } from './pdfParser';
import { parseDocx } from './docxParser';
import { parseMarkdown } from './markdownParser';
import { parseCsv } from './csvParser';
import { parseTxt } from './txtParser';
import { parseJson } from './jsonParser';

const PARSERS: Record<string, (file: File) => Promise<ParserResult>> = {
  '.pdf': parsePdf,
  '.docx': parseDocx,
  '.doc': parseDocx,
  '.md': parseMarkdown,
  '.markdown': parseMarkdown,
  '.csv': parseCsv,
  '.txt': parseTxt,
  '.json': parseJson,
};

export const SUPPORTED_EXTENSIONS = Object.keys(PARSERS);
export const ACCEPT_STRING = SUPPORTED_EXTENSIONS.join(',');

export async function parseFile(file: File): Promise<ParserResult> {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const parser = PARSERS[ext];
  if (!parser) {
    throw new Error(`Unsupported file format: ${ext}`);
  }
  return parser(file);
}
