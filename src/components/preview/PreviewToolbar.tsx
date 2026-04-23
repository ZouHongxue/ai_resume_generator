import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import { getTemplateList } from '../templates/TemplateRegistry';
import { exportToPdf, exportToJson } from '../../lib/export/exportUtils';

export default function PreviewToolbar() {
  const { t, i18n } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const updateMeta = useResumeStore((s) => s.updateMeta);
  const isZh = i18n.language?.startsWith('zh');
  const templates = getTemplateList();

  return (
    <div className="flex flex-wrap items-center gap-2 no-print w-full max-w-[210mm]">
      <select
        value={resume.meta.templateId}
        onChange={(e) => updateMeta({ templateId: e.target.value })}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:border-blue-500"
      >
        {templates.map((tmpl) => (
          <option key={tmpl.id} value={tmpl.id}>
            {isZh ? tmpl.nameZh : tmpl.name}
          </option>
        ))}
      </select>

      <select
        value={resume.meta.language}
        onChange={(e) => updateMeta({ language: e.target.value as 'en' | 'zh' })}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:border-blue-500"
      >
        <option value="zh">中文简历</option>
        <option value="en">English Resume</option>
      </select>

      <div className="flex-1" />

      <Button variant="secondary" size="sm" onClick={() => exportToJson(resume)}>
        {t('actions.exportJson')}
      </Button>
      <Button variant="primary" size="sm" onClick={() => exportToPdf()}>
        {t('actions.exportPdf')}
      </Button>
    </div>
  );
}
