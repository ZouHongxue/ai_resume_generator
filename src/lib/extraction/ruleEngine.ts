import type { ExtractionResult } from '../../types/extraction';
import type { WorkExperience, Education, Skill } from '../../types/resume';
import { createEmptyResume } from '../../types/resume';

const EMAIL_RE = /[\w.-]+@[\w.-]+\.\w+/;
const PHONE_RE = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}|1[3-9]\d{9}/;
const URL_RE = /https?:\/\/[^\s]+/g;
const DATE_RANGE_RE = /(\d{4}[-/]\d{1,2})\s*[-–~至to]+\s*(\d{4}[-/]\d{1,2}|Present|至今|now)/gi;
const SINGLE_DATE_RE = /\d{4}[-/]\d{1,2}/;

const SECTION_KEYWORDS: Record<string, RegExp> = {
  education: /^(?:education|教育(?:经历|背景)?|学历)\s*$/i,
  workExperience: /^(?:(?:work\s*)?experience|工作(?:经历|经验)|职业经历|employment)\s*$/i,
  skills: /^(?:skills?|技能|专业技能|技术栈|technical\s*skills?)\s*$/i,
  projects: /^(?:projects?|项目(?:经历|经验)?)\s*$/i,
  certifications: /^(?:certifications?|certificates?|证书|资质|licenses?)\s*$/i,
  summary: /^(?:summary|profile|(?:个人)?简介|about\s*me|objective)\s*$/i,
};

export function extractByRules(rawText: string): ExtractionResult {
  const resume = createEmptyResume();
  const confidence: Record<string, number> = {};
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  // Extract email
  const emailMatch = rawText.match(EMAIL_RE);
  if (emailMatch) {
    resume.personalInfo.email = emailMatch[0];
    confidence['personalInfo.email'] = 0.9;
  }

  // Extract phone
  const phoneMatch = rawText.match(PHONE_RE);
  if (phoneMatch) {
    resume.personalInfo.phone = phoneMatch[0];
    confidence['personalInfo.phone'] = 0.9;
  }

  // Extract URLs
  const urls = rawText.match(URL_RE) || [];
  for (const url of urls) {
    if (/github\.com/i.test(url)) {
      resume.personalInfo.github = url;
      confidence['personalInfo.github'] = 0.8;
    } else if (/linkedin\.com/i.test(url)) {
      resume.personalInfo.linkedin = url;
      confidence['personalInfo.linkedin'] = 0.8;
    } else if (!resume.personalInfo.website) {
      resume.personalInfo.website = url;
      confidence['personalInfo.website'] = 0.5;
    }
  }

  // Guess name: first non-empty line that isn't an email/phone/url/section header
  for (const line of lines.slice(0, 5)) {
    if (
      !EMAIL_RE.test(line) &&
      !PHONE_RE.test(line) &&
      !URL_RE.test(line) &&
      !Object.values(SECTION_KEYWORDS).some((re) => re.test(line)) &&
      line.length < 30
    ) {
      resume.personalInfo.name = line;
      confidence['personalInfo.name'] = 0.6;
      break;
    }
  }

  // Split into sections
  const sections = splitSections(lines);

  // Parse summary
  if (sections.summary) {
    resume.summary = sections.summary.join('\n');
    confidence['summary'] = 0.7;
  }

  // Parse education
  if (sections.education) {
    resume.education = parseEducation(sections.education);
    if (resume.education.length > 0) confidence['education'] = 0.6;
  }

  // Parse work experience
  if (sections.workExperience) {
    resume.workExperience = parseWorkExperience(sections.workExperience);
    if (resume.workExperience.length > 0) confidence['workExperience'] = 0.6;
  }

  // Parse skills
  if (sections.skills) {
    resume.skills = parseSkills(sections.skills);
    if (resume.skills.length > 0) confidence['skills'] = 0.7;
  }

  return { data: resume, confidence, mode: 'rule', rawText };
}

function splitSections(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let currentSection = 'header';
  sections[currentSection] = [];

  for (const line of lines) {
    let matched = false;
    for (const [key, re] of Object.entries(SECTION_KEYWORDS)) {
      if (re.test(line)) {
        currentSection = key;
        sections[currentSection] = [];
        matched = true;
        break;
      }
    }
    if (!matched) {
      (sections[currentSection] ??= []).push(line);
    }
  }

  return sections;
}

function parseEducation(lines: string[]): Education[] {
  const entries: Education[] = [];
  let current: Partial<Education> | null = null;

  for (const line of lines) {
    const dateMatch = line.match(DATE_RANGE_RE);
    if (dateMatch || (line.length < 80 && !line.startsWith('-') && !line.startsWith('•'))) {
      if (current?.institution) {
        entries.push(finalizeEducation(current));
      }
      current = { id: crypto.randomUUID(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' };

      if (dateMatch) {
        const parts = dateMatch[0].split(/[-–~至to]+/i).map((s) => s.trim());
        current.startDate = parts[0] || '';
        current.endDate = parts[1] || '';
        current.institution = line.replace(DATE_RANGE_RE, '').trim();
      } else {
        // Check for a single date (treat as endDate, e.g. graduation date)
        const singleDate = line.match(SINGLE_DATE_RE);
        if (singleDate) {
          current.endDate = singleDate[0];
          current.institution = line.replace(SINGLE_DATE_RE, '').trim();
        } else {
          current.institution = line;
        }
      }
    } else if (current) {
      const degreeMatch = line.match(/(bachelor|master|phd|doctor|博士|硕士|学士|本科|大专|MBA|associate)/i);
      if (degreeMatch) {
        // Try to split degree and field
        // Patterns: "Bachelor of Computer Science", "计算机科学 本科", "硕士 软件工程"
        const degreeWord = degreeMatch[0];
        const rest = line.replace(degreeWord, '').replace(/^[\s,，·|of in]+|[\s,，·|]+$/gi, '').trim();
        current.degree = degreeWord;
        if (rest && !current.field) {
          current.field = rest;
        }
      } else {
        current.description = ((current.description || '') + ' ' + line).trim();
      }
    }
  }
  if (current?.institution) entries.push(finalizeEducation(current));
  return entries;
}

function finalizeEducation(partial: Partial<Education>): Education {
  return {
    id: partial.id || crypto.randomUUID(),
    institution: partial.institution || '',
    degree: partial.degree || '',
    field: partial.field || '',
    startDate: partial.startDate || '',
    endDate: partial.endDate || '',
    gpa: partial.gpa || '',
    description: partial.description || '',
  };
}

function parseWorkExperience(lines: string[]): WorkExperience[] {
  const entries: WorkExperience[] = [];
  let current: Partial<WorkExperience> | null = null;

  for (const line of lines) {
    const dateMatch = line.match(DATE_RANGE_RE);
    const isBullet = /^[-•*]\s/.test(line) || /^\d+[.)]\s/.test(line);

    if (dateMatch && !isBullet) {
      if (current?.company) entries.push(finalizeWork(current));
      current = { id: crypto.randomUUID(), company: '', position: '', location: '', startDate: '', endDate: '', highlights: [] };
      const parts = dateMatch[0].split(/[-–~至to]+/i).map((s) => s.trim());
      current.startDate = parts[0] || '';
      current.endDate = parts[1] || '';
      current.company = line.replace(DATE_RANGE_RE, '').trim();
    } else if (isBullet && current) {
      current.highlights = [...(current.highlights || []), line.replace(/^[-•*\d.)]+\s*/, '')];
    } else if (current && !current.position && line.length < 60) {
      current.position = line;
    } else if (!current && line.length < 80) {
      current = { id: crypto.randomUUID(), company: line, position: '', location: '', startDate: '', endDate: '', highlights: [] };
    }
  }
  if (current?.company) entries.push(finalizeWork(current));
  return entries;
}

function finalizeWork(partial: Partial<WorkExperience>): WorkExperience {
  return {
    id: partial.id || crypto.randomUUID(),
    company: partial.company || '',
    position: partial.position || '',
    location: partial.location || '',
    startDate: partial.startDate || '',
    endDate: partial.endDate || '',
    highlights: partial.highlights || [],
  };
}

// Known skill keywords for auto-categorization
const SKILL_CATEGORIES: Record<string, RegExp> = {
  'Programming Languages': /^(java|python|c\+\+|c#|javascript|typescript|go|rust|ruby|php|swift|kotlin|scala|perl|r|matlab|dart|lua|shell|bash|sql|html|css)$/i,
  'Frameworks': /^(react|vue|angular|next\.?js|nuxt|express|spring|django|flask|rails|laravel|\.net|fastapi|nestjs|svelte|remix|gatsby)$/i,
  'Databases': /^(mysql|postgresql|postgres|mongodb|redis|elasticsearch|sqlite|oracle|dynamodb|cassandra|neo4j|mariadb|mssql|influxdb)$/i,
  'Cloud & DevOps': /^(aws|azure|gcp|docker|kubernetes|k8s|terraform|jenkins|github\s*actions|gitlab\s*ci|ci\/cd|nginx|linux|ansible|helm|prometheus|grafana)$/i,
  'Tools': /^(git|jira|figma|sketch|postman|webpack|vite|npm|yarn|maven|gradle|cmake|vs\s*code|intellij|xcode)$/i,
};

function categorizeSkill(skill: string): string {
  for (const [category, re] of Object.entries(SKILL_CATEGORIES)) {
    if (re.test(skill.trim())) return category;
  }
  return '';
}

function parseSkills(lines: string[]): Skill[] {
  const skills: Skill[] = [];
  const uncategorized: string[] = [];

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    const chineseColonIdx = line.indexOf('：');
    const splitIdx = Math.max(colonIdx, chineseColonIdx);

    if (splitIdx > 0) {
      const category = line.slice(0, splitIdx).trim();
      const items = line
        .slice(splitIdx + 1)
        .split(/[,，、;；|/]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length > 0) {
        skills.push({ id: crypto.randomUUID(), category, items });
      }
    } else {
      const items = line
        .split(/[,，、;；|/]/)
        .map((s) => s.trim())
        .filter(Boolean);
      uncategorized.push(...items);
    }
  }

  // Auto-categorize uncategorized skills
  if (uncategorized.length > 0) {
    const grouped: Record<string, string[]> = {};
    for (const item of uncategorized) {
      const cat = categorizeSkill(item) || 'Other';
      (grouped[cat] ??= []).push(item);
    }
    for (const [category, items] of Object.entries(grouped)) {
      skills.push({ id: crypto.randomUUID(), category, items });
    }
  }

  return skills;
}
