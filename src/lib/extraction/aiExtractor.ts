import type { AiConfig } from '../../types/extraction';
import type { ResumeData } from '../../types/resume';
import { createEmptyResume } from '../../types/resume';

const SYSTEM_PROMPT = `You are a resume parser. Extract structured data from the provided resume text.
Return ONLY valid JSON matching this exact schema (no markdown, no explanation):

{
  "personalInfo": {
    "name": "", "title": "", "email": "", "phone": "", "location": "",
    "website": "", "linkedin": "", "github": ""
  },
  "summary": "",
  "education": [{ "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "gpa": "", "description": "" }],
  "workExperience": [{ "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "highlights": [""] }],
  "skills": [{ "category": "", "items": [""] }],
  "projects": [{ "name": "", "role": "", "url": "", "startDate": "", "endDate": "", "description": "", "highlights": [""] }],
  "certifications": [{ "name": "", "issuer": "", "date": "", "url": "" }],
  "customSections": [{ "title": "", "content": "" }]
}

Rules:
- Use empty string "" for missing fields, empty array [] for missing lists
- Dates should be in YYYY-MM format when possible. If only one date is present (e.g. graduation date), put it in "endDate" and leave "startDate" as ""
- Keep highlights as individual bullet points
- Detect and use the original language of the content
- Put the personal summary/profile/objective into the top-level "summary" field
- For education: "degree" is ONLY the degree level (e.g. "Bachelor", "Master", "PhD", "本科", "硕士", "博士"). "field" is the major/subject (e.g. "Computer Science", "计算机科学"). Do NOT combine them into one field
- For skills: If the original resume already groups skills with category labels, preserve those original categories exactly as-is. Only when the resume lists skills without any categorization should you infer and create appropriate categories (e.g. "Programming Languages", "Frameworks", "Databases", "Tools"). Never put all skills into a single category
- Any content that does NOT fit into the above standard sections (e.g. awards, publications, volunteer, hobbies, self-evaluation, languages, references, or any other titled section) MUST be placed in customSections with the original section title
- Do NOT discard any content from the resume. Every section must appear somewhere in the output`;

async function callOpenAI(text: string, config: AiConfig): Promise<string> {
  const base = config.baseUrl.replace(/\/+$/, '').replace(/\/v1$/, '');
  const response = await fetch(`${base}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty AI response');
  return content;
}

async function callOllama(text: string, config: AiConfig): Promise<string> {
  const base = config.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      stream: false,
      options: { temperature: 0.1 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const content = result.message?.content;
  if (!content) throw new Error('Empty Ollama response');
  return content;
}

export async function extractWithAi(
  text: string,
  config: AiConfig,
): Promise<Partial<ResumeData>> {
  const content = config.provider === 'ollama'
    ? await callOllama(text, config)
    : await callOpenAI(text, config);

  // Extract JSON from response (handle possible markdown wrapping)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in AI response');

  const parsed = JSON.parse(jsonMatch[0]);
  const emptyResume = createEmptyResume();

  // Merge parsed data, adding IDs
  return {
    personalInfo: { ...emptyResume.personalInfo, ...parsed.personalInfo },
    summary: parsed.summary || '',
    education: (parsed.education || []).map((e: Record<string, unknown>) => ({
      ...e,
      id: crypto.randomUUID(),
    })),
    workExperience: (parsed.workExperience || []).map((e: Record<string, unknown>) => ({
      ...e,
      id: crypto.randomUUID(),
    })),
    skills: (parsed.skills || []).map((e: Record<string, unknown>) => ({
      ...e,
      id: crypto.randomUUID(),
    })),
    projects: (parsed.projects || []).map((e: Record<string, unknown>) => ({
      ...e,
      id: crypto.randomUUID(),
    })),
    certifications: (parsed.certifications || []).map((e: Record<string, unknown>) => ({
      ...e,
      id: crypto.randomUUID(),
    })),
    customSections: (parsed.customSections || []).map((e: Record<string, unknown>) => ({
      ...e,
      id: crypto.randomUUID(),
    })),
  };
}
