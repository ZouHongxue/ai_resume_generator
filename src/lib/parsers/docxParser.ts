import type { ParserResult } from '../../types/extraction';
import mammoth from 'mammoth';

export async function parseDocx(file: File): Promise<ParserResult> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return { text: result.value };
}
