import type { ParserResult } from '../../types/extraction';
import Papa from 'papaparse';

export async function parseCsv(file: File): Promise<ParserResult> {
  const text = await file.text();
  const result = Papa.parse(text, { header: true, skipEmptyLines: true });
  const rows = result.data as Record<string, string>[];
  const textLines = rows.map((row) =>
    Object.entries(row)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', '),
  );
  return { text: textLines.join('\n') };
}
