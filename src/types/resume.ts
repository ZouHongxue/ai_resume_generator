export interface ResumeData {
  meta: ResumeMeta;
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
}

export type SectionKey =
  | 'personalInfo'
  | 'summary'
  | 'education'
  | 'workExperience'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'customSections';

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'personalInfo',
  'summary',
  'workExperience',
  'projects',
  'education',
  'skills',
  'certifications',
  'customSections',
];

export interface ResumeMeta {
  id: string;
  title: string;
  language: 'en' | 'zh';
  templateId: string;
  sectionOrder: SectionKey[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  role: string;
  url: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export function createEmptyResume(): ResumeData {
  return {
    meta: {
      id: crypto.randomUUID(),
      title: '',
      language: 'zh',
      templateId: 'classic',
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
    },
    summary: '',
    education: [],
    workExperience: [],
    skills: [],
    projects: [],
    certifications: [],
    customSections: [],
  };
}
