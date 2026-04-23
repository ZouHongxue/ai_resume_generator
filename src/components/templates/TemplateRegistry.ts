import type { FC } from 'react';
import type { TemplateMeta, TemplateProps } from '../../types/template';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';

interface TemplateEntry {
  meta: TemplateMeta;
  component: FC<TemplateProps>;
}

export const templates: Record<string, TemplateEntry> = {
  classic: {
    meta: {
      id: 'classic',
      name: 'Classic',
      nameZh: '经典',
      description: 'Traditional single-column layout',
      descriptionZh: '传统单栏布局',
    },
    component: ClassicTemplate,
  },
  modern: {
    meta: {
      id: 'modern',
      name: 'Modern',
      nameZh: '现代',
      description: 'Two-column layout with accent sidebar',
      descriptionZh: '双栏布局，侧边栏配色',
    },
    component: ModernTemplate,
  },
  minimal: {
    meta: {
      id: 'minimal',
      name: 'Minimal',
      nameZh: '极简',
      description: 'Clean single-column with lots of whitespace',
      descriptionZh: '简洁单栏，留白充裕',
    },
    component: MinimalTemplate,
  },
};

export function getTemplate(id: string): TemplateEntry {
  return templates[id] || templates.classic;
}

export function getTemplateList(): TemplateMeta[] {
  return Object.values(templates).map((t) => t.meta);
}
