import type { ParserResult } from '../../types/extraction';
import { marked } from 'marked';

export async function parseMarkdown(file: File): Promise<ParserResult> {
  const text = await file.text();
  // Convert to HTML then strip tags to get clean text for extraction
  const html = await marked(text);
  const plainText = html.replace(/<[^>]*>/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return { text: plainText, metadata: { originalMarkdown: text } };
}
