import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import type { CustomSection } from '../../types/resume';

export default function CustomSectionForm() {
  const { t } = useTranslation();
  const sections = useResumeStore((s) => s.resume.customSections);
  const add = useResumeStore((s) => s.addCustomSection);
  const remove = useResumeStore((s) => s.removeCustomSection);
  const update = useResumeStore((s) => s.updateCustomSection);

  const addNew = () => {
    const item: CustomSection = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
    };
    add(item);
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {section.title || t('editor.customSections')}
            </span>
            <Button variant="danger" size="sm" onClick={() => remove(section.id)}>
              {t('actions.remove')}
            </Button>
          </div>
          <Input
            label={t('fields.sectionTitle')}
            value={section.title}
            onChange={(e) => update(section.id, { title: e.target.value })}
          />
          <TextArea
            label={t('fields.content')}
            value={section.content}
            onChange={(e) => update(section.id, { content: e.target.value })}
            rows={4}
            placeholder="Supports markdown"
          />
        </div>
      ))}
      <Button variant="secondary" onClick={addNew}>
        + {t('actions.add')}{t('editor.customSections')}
      </Button>
    </div>
  );
}
