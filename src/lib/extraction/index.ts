import type { ExtractionResult, ExtractionMode } from '../../types/extraction';
import type { AiConfig } from '../../types/extraction';
import type { ResumeData } from '../../types/resume';
import { extractByRules } from './ruleEngine';
import { extractWithAi } from './aiExtractor';

export async function extractResume(
  text: string,
  mode: ExtractionMode,
  aiConfig?: AiConfig,
): Promise<ExtractionResult> {
  // If JSON and it's a valid ResumeData, use it directly regardless of mode
  try {
    const parsed = JSON.parse(text);
    if (parsed.meta && parsed.personalInfo) {
      return {
        data: parsed as ResumeData,
        confidence: { direct: 1.0 },
        mode: 'rule',
        rawText: text,
      };
    }
  } catch {
    // Not JSON, continue with extraction
  }

  // Rule mode: only run rule engine
  if (mode === 'rule') {
    return extractByRules(text);
  }

  // AI mode: run AI extraction, throw on failure (don't silently fall back)
  if (!aiConfig) {
    throw new Error('AI mode requires configuration');
  }
  if (aiConfig.provider === 'openai' && !aiConfig.apiKey) {
    throw new Error('OpenAI mode requires an API Key');
  }

  const ruleResult = extractByRules(text);

  const aiData = await extractWithAi(text, aiConfig);
  // Merge: AI results take priority, rule fills gaps
  const merged: Partial<ResumeData> = {
    ...ruleResult.data,
    ...aiData,
    personalInfo: {
      ...(ruleResult.data as ResumeData).personalInfo,
      ...aiData.personalInfo,
    },
  };
  return {
    data: merged,
    confidence: { ...ruleResult.confidence, ai: 0.85 },
    mode: 'ai',
    rawText: text,
  };
}
