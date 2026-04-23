import type { ParserResult } from '../../types/extraction';

export async function parseJson(file: File): Promise<ParserResult> {
  const text = await file.text();
  // Try to parse - if it matches resume schema, we'll handle that in the extraction layer
  try {
    JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON file');
  }
  return { text, metadata: { isJson: 'true' } };
}
