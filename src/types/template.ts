import type { ResumeData } from './resume';

export interface TemplateMeta {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
}

export interface TemplateProps {
  data: ResumeData;
  className?: string;
}
