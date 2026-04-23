import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import type { Education } from '../../types/resume';

export default function EducationForm() {
  const { t } = useTranslation();
  const education = useResumeStore((s) => s.resume.education);
  const add = useResumeStore((s) => s.addEducation);
  const remove = useResumeStore((s) => s.removeEducation);
  const update = useResumeStore((s) => s.updateEducation);

  const addNew = () => {
    const item: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };
    add(item);
  };

  return (
    <div className="space-y-4">
      {education.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {edu.institution || t('editor.education')}
            </span>
            <Button variant="danger" size="sm" onClick={() => remove(edu.id)}>
              {t('actions.remove')}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('fields.institution')} value={edu.institution} onChange={(e) => update(edu.id, { institution: e.target.value })} />
            <Input label={t('fields.degree')} value={edu.degree} onChange={(e) => update(edu.id, { degree: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label={t('fields.field')} value={edu.field} onChange={(e) => update(edu.id, { field: e.target.value })} />
            <Input label={t('fields.startDate')} value={edu.startDate} onChange={(e) => update(edu.id, { startDate: e.target.value })} placeholder="2020-09" />
            <Input label={t('fields.endDate')} value={edu.endDate} onChange={(e) => update(edu.id, { endDate: e.target.value })} placeholder="2024-06" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Input label={t('fields.gpa')} value={edu.gpa} onChange={(e) => update(edu.id, { gpa: e.target.value })} />
          </div>
          <TextArea label={t('fields.description')} value={edu.description} onChange={(e) => update(edu.id, { description: e.target.value })} rows={2} />
        </div>
      ))}
      <Button variant="secondary" onClick={addNew}>
        + {t('actions.add')}{t('editor.education')}
      </Button>
    </div>
  );
}
