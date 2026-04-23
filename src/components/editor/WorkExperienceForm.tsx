import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import type { WorkExperience } from '../../types/resume';

export default function WorkExperienceForm() {
  const { t } = useTranslation();
  const workExperience = useResumeStore((s) => s.resume.workExperience);
  const add = useResumeStore((s) => s.addWorkExperience);
  const remove = useResumeStore((s) => s.removeWorkExperience);
  const update = useResumeStore((s) => s.updateWorkExperience);

  const addNew = () => {
    const item: WorkExperience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      highlights: [''],
    };
    add(item);
  };

  const updateHighlight = (expId: string, index: number, value: string) => {
    const exp = workExperience.find((e) => e.id === expId);
    if (!exp) return;
    const highlights = [...exp.highlights];
    highlights[index] = value;
    update(expId, { highlights });
  };

  const addHighlight = (expId: string) => {
    const exp = workExperience.find((e) => e.id === expId);
    if (!exp) return;
    update(expId, { highlights: [...exp.highlights, ''] });
  };

  const removeHighlight = (expId: string, index: number) => {
    const exp = workExperience.find((e) => e.id === expId);
    if (!exp) return;
    update(expId, { highlights: exp.highlights.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {workExperience.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {exp.company || t('editor.workExperience')}
            </span>
            <Button variant="danger" size="sm" onClick={() => remove(exp.id)}>
              {t('actions.remove')}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('fields.company')} value={exp.company} onChange={(e) => update(exp.id, { company: e.target.value })} />
            <Input label={t('fields.position')} value={exp.position} onChange={(e) => update(exp.id, { position: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label={t('fields.location')} value={exp.location} onChange={(e) => update(exp.id, { location: e.target.value })} />
            <Input label={t('fields.startDate')} value={exp.startDate} onChange={(e) => update(exp.id, { startDate: e.target.value })} placeholder="2022-01" />
            <Input label={t('fields.endDate')} value={exp.endDate} onChange={(e) => update(exp.id, { endDate: e.target.value })} placeholder={t('fields.present')} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">{t('fields.highlights')}</label>
            {exp.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={h}
                  onChange={(e) => updateHighlight(exp.id, i, e.target.value)}
                  placeholder={`${t('fields.highlights')} ${i + 1}`}
                />
                <Button variant="danger" size="sm" onClick={() => removeHighlight(exp.id, i)}>
                  &times;
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => addHighlight(exp.id)}>
              + {t('actions.addHighlight')}
            </Button>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addNew}>
        + {t('actions.add')}{t('editor.workExperience')}
      </Button>
    </div>
  );
}
