import type { ResumeData } from '../../types/resume';
import type { AiConfig } from '../../types/extraction';

function buildContext(resume: ResumeData): string {
  const parts: string[] = [];
  const { personalInfo, workExperience, education, skills, projects, certifications } = resume;

  if (personalInfo.name) parts.push(`Name: ${personalInfo.name}`);
  if (personalInfo.title) parts.push(`Title: ${personalInfo.title}`);

  if (workExperience.length > 0) {
    parts.push('\nWork Experience:');
    for (const exp of workExperience) {
      parts.push(`- ${exp.position} at ${exp.company} (${exp.startDate} – ${exp.endDate || 'Present'})`);
      for (const h of exp.highlights.filter(Boolean)) parts.push(`  • ${h}`);
    }
  }

  if (projects.length > 0) {
    parts.push('\nProjects:');
    for (const proj of projects) {
      parts.push(`- ${proj.name}${proj.role ? ` (${proj.role})` : ''}: ${proj.description}`);
    }
  }

  if (education.length > 0) {
    parts.push('\nEducation:');
    for (const edu of education) {
      parts.push(`- ${edu.degree} in ${edu.field} from ${edu.institution}`);
    }
  }

  if (skills.length > 0) {
    parts.push('\nSkills:');
    for (const skill of skills) {
      parts.push(`- ${skill.category}: ${skill.items.join(', ')}`);
    }
  }

  if (certifications.length > 0) {
    parts.push('\nCertifications:');
    for (const cert of certifications) {
      parts.push(`- ${cert.name} (${cert.issuer})`);
    }
  }

  return parts.join('\n');
}

const PROMPT = `Based on the following resume information, write a concise professional summary (3-5 sentences).
The summary should highlight key strengths, years of experience, and core competencies.
Write in the same language as the resume content (Chinese if the content is in Chinese, English if in English).
Return ONLY the summary text, no quotes, no labels, no explanation.`;

export async function generateSummary(
  resume: ResumeData,
  config: AiConfig,
): Promise<string> {
  const context = buildContext(resume);
  if (!context.trim()) throw new Error('No resume content to generate from');

  const messages = [
    { role: 'system', content: PROMPT },
    { role: 'user', content: context },
  ];

  let content: string;

  if (config.provider === 'ollama') {
    const base = config.baseUrl.replace(/\/+$/, '');
    const response = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: false,
        options: { temperature: 0.7 },
      }),
    });
    if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
    const result = await response.json();
    content = result.message?.content;
  } else {
    const base = config.baseUrl.replace(/\/+$/, '').replace(/\/v1$/, '');
    const response = await fetch(`${base}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.7,
      }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const result = await response.json();
    content = result.choices?.[0]?.message?.content;
  }

  if (!content) throw new Error('Empty AI response');
  return content.trim();
}
