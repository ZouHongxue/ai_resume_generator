import type { ResumeData } from './resume';

export type ExtractionMode = 'rule' | 'ai';

export interface ExtractionResult {
  data: Partial<ResumeData>;
  confidence: Record<string, number>;
  mode: ExtractionMode;
  rawText: string;
}

export interface ParserResult {
  text: string;
  metadata?: Record<string, string>;
}

export type AiProvider = 'openai' | 'ollama';

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}
