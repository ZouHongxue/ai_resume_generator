import type { ParserResult } from '../../types/extraction';

export async function parseTxt(file: File): Promise<ParserResult> {
  const text = await file.text();
  return { text };
}
