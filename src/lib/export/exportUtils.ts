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
        width: 210mm !important;
        min-height: 297mm !important;
      }
    }

    /* Screen: hide everything except the resume when displayed */
    body {
      margin: 0;
      padding: 0;
      background: white;
    }
  </style>
</head>
<body>
  ${element.innerHTML}
</body>
</html>`);

  printWindow.document.close();

  // Wait for styles/fonts to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // Fallback if onload doesn't fire
  setTimeout(() => {
    if (!printWindow.closed) {
      printWindow.print();
      printWindow.close();
    }
  }, 2000);
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
