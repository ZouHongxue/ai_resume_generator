import type { ResumeData } from '../types/resume';

export interface SpacingConfig {
  /** Gap between sections: 'mb-4' | 'mb-6' | 'mb-8' */
  sectionGap: string;
  /** Gap between items within a section: 'mb-2' | 'mb-3' | 'mb-4' */
  itemGap: string;
  /** Line height for body text: 'leading-relaxed' | 'leading-loose' | 'leading-[2]' */
  lineHeight: string;
  /** Font size for body: 'text-xs' | 'text-sm' */
  bodySize: string;
  /** Extra padding on the page */
  pagePadding: string;
}

/**
 * Estimate content "lines" to determine density.
 * Returns a rough count of visual lines the content would occupy.
 */
function estimateLines(data: ResumeData): number {
  let lines = 0;

  // Personal info header ~3 lines
  if (data.personalInfo.name) lines += 3;

  // Summary
  if (data.summary) lines += Math.ceil(data.summary.length / 60) + 1;

  // Work experience
  for (const exp of data.workExperience) {
    lines += 2; // company + position line + date
    lines += exp.highlights.filter(Boolean).length;
  }

  // Projects
  for (const proj of data.projects) {
    lines += 2;
    if (proj.description) lines += Math.ceil(proj.description.length / 60);
    lines += proj.highlights.filter(Boolean).length;
  }

  // Education
  lines += data.education.length * 2;

  // Skills
  lines += data.skills.length * 1.5;

  // Certifications
  lines += data.certifications.length;

  // Custom sections
  for (const s of data.customSections) {
    lines += 1 + Math.ceil(s.content.length / 60);
  }

  return lines;
}

/**
 * Returns spacing config based on content density.
 * - sparse (<20 lines): loose spacing
 * - medium (20-40 lines): normal spacing
 * - dense (>40 lines): compact spacing
 */
export function getSpacing(data: ResumeData): SpacingConfig {
  const lines = estimateLines(data);

  if (lines < 15) {
    // Very sparse - maximize whitespace
    return {
      sectionGap: 'mb-8',
      itemGap: 'mb-5',
      lineHeight: 'leading-[2]',
      bodySize: 'text-sm',
      pagePadding: '20mm 25mm',
    };
  }

  if (lines < 30) {
    // Moderate - comfortable spacing
    return {
      sectionGap: 'mb-6',
      itemGap: 'mb-4',
      lineHeight: 'leading-loose',
      bodySize: 'text-sm',
      pagePadding: '18mm 22mm',
    };
  }

  if (lines < 45) {
    // Normal
    return {
      sectionGap: 'mb-4',
      itemGap: 'mb-3',
      lineHeight: 'leading-relaxed',
      bodySize: 'text-xs',
      pagePadding: '15mm 20mm',
    };
  }

  // Dense - compact
  return {
    sectionGap: 'mb-3',
    itemGap: 'mb-2',
    lineHeight: 'leading-normal',
    bodySize: 'text-xs',
    pagePadding: '12mm 15mm',
  };
}
