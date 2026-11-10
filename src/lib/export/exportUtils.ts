import type { ResumeData } from '../../types/resume';

export async function exportToPdf() {
  const element = document.getElementById('resume-preview');
  if (!element) return;

  // Create a new window with just the resume content for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export PDF');
    return;
  }

  // Collect all stylesheets from the current page
  const styles: string[] = [];
  for (const sheet of document.styleSheets) {
    try {
      const rules = Array.from(sheet.cssRules)
        .map((r) => r.cssText)
        .join('\n');
      styles.push(rules);
    } catch {
      // Cross-origin stylesheet, skip
      if (sheet.href) {
        styles.push(`@import url("${sheet.href}");`);
      }
    }
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume</title>
  <style>
    ${styles.join('\n')}

    /* Print overrides */
    @media print {
      @page {
        size: A4;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .a4-page {
        box-shadow: none !important;
        margin: 0 !important;
        transform: none !important;
      }
    }

    /* Screen: hide everything except the resume when displayed */
    body {
      margin: 0;
      padding: 0;
      background: white;
    }
    .a4-page {
      box-shadow: none !important;
      width: 210mm;
      /* Exactly 297mm rounds up by a pixel and spills onto a blank second page */
      min-height: ${A4_MIN_HEIGHT_MM}mm !important;
    }
  </style>
</head>
<body>
  ${element.innerHTML}
</body>
</html>`);

  printWindow.document.close();

  let printed = false;
  const run = async () => {
    if (printed || printWindow.closed) return;
    printed = true;
    try {
      await printWindow.document.fonts?.ready;
    } catch {
      // Font loading errors should not block printing
    }
    trimTrailingSectionMargin(printWindow.document);
    fitToOnePage(printWindow.document);
    printWindow.print();
    printWindow.close();
  };

  // Wait for styles/fonts to load, then trigger print
  printWindow.onload = () => setTimeout(run, 300);

  // Fallback if onload doesn't fire
  setTimeout(run, 2000);
}

const A4_MIN_HEIGHT_MM = 296;
/** Content up to this much taller than one page is scaled down to fit instead of spilling over */
const MAX_FIT_OVERFLOW = 0.15;

function mmToPx(doc: Document, mm: number): number {
  const probe = doc.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;height:${mm}mm`;
  doc.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return px;
}

/**
 * Drop the bottom margin of the last section in each column; it only adds height at
 * the bottom of the page. Templates wrap every section in its own <div>, so a CSS
 * `section:last-child` rule would match every section, not just the last one.
 */
function trimTrailingSectionMargin(doc: Document) {
  const page = doc.querySelector<HTMLElement>('.a4-page');
  if (!page) return;
  const isMultiColumn = getComputedStyle(page).display === 'flex';
  const lastByColumn = new Map<Element, HTMLElement>();
  for (const section of page.querySelectorAll<HTMLElement>('section')) {
    const column = isMultiColumn ? (Array.from(page.children).find((c) => c.contains(section)) ?? page) : page;
    lastByColumn.set(column, section);
  }
  for (const section of lastByColumn.values()) {
    section.style.setProperty('margin-bottom', '0', 'important');
  }
}

/**
 * If the resume is only slightly taller than one A4 page, shrink it uniformly so it
 * prints on a single page. The page is widened by 1/zoom so the printed width stays 210mm.
 */
function fitToOnePage(doc: Document) {
  const page = doc.querySelector<HTMLElement>('.a4-page');
  if (!page) return;

  const pageHeight = mmToPx(doc, A4_MIN_HEIGHT_MM);
  // Natural (unzoomed) content height at a given layout width
  const heightAtWidth = (widthMm: number) => {
    page.style.setProperty('width', `${widthMm}mm`, 'important');
    page.style.setProperty('min-height', '0', 'important');
    return page.getBoundingClientRect().height;
  };

  const natural = heightAtWidth(210);
  if (natural <= pageHeight || natural > pageHeight * (1 + MAX_FIT_OVERFLOW)) {
    page.style.removeProperty('width');
    page.style.removeProperty('min-height');
    return;
  }

  // Widening reflows text and changes the height, so refine a few times
  let zoom = pageHeight / natural;
  for (let i = 0; i < 5; i++) {
    const printed = heightAtWidth(210 / zoom) * zoom;
    if (printed <= pageHeight) break;
    zoom *= pageHeight / printed;
  }

  page.style.setProperty('width', `${210 / zoom}mm`, 'important');
  page.style.setProperty('min-height', `${A4_MIN_HEIGHT_MM / zoom}mm`, 'important');
  page.style.zoom = String(zoom);
}

export function exportToJson(resume: ResumeData) {
  const json = JSON.stringify(resume, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume-${resume.meta.id.slice(0, 8)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJson(): Promise<ResumeData | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      try {
        const text = await file.text();
        const data = JSON.parse(text) as ResumeData;
        if (data.meta && data.personalInfo) {
          resolve(data);
        } else {
          alert('Invalid resume JSON format');
          resolve(null);
        }
      } catch {
        alert('Failed to parse JSON file');
        resolve(null);
      }
    };
    input.click();
  });
}
