import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import type { Project } from '../../types/resume';

export default function ProjectsForm() {
  const { t } = useTranslation();
  const projects = useResumeStore((s) => s.resume.projects);
  const add = useResumeStore((s) => s.addProject);
  const remove = useResumeStore((s) => s.removeProject);
  const update = useResumeStore((s) => s.updateProject);

  const addNew = () => {
    const item: Project = {
      id: crypto.randomUUID(),
      name: '',
      role: '',
      url: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: [''],
    };
    add(item);
  };

  const updateHighlight = (projId: string, index: number, value: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const highlights = [...proj.highlights];
    highlights[index] = value;
    update(projId, { highlights });
  };

  const addHighlight = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    update(projId, { highlights: [...proj.highlights, ''] });
  };

  const removeHighlight = (projId: string, index: number) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    update(projId, { highlights: proj.highlights.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {projects.map((proj) => (
        <div key={proj.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {proj.name || t('editor.projects')}
            </span>
            <Button variant="danger" size="sm" onClick={() => remove(proj.id)}>
              {t('actions.remove')}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('fields.projectName')} value={proj.name} onChange={(e) => update(proj.id, { name: e.target.value })} />
            <Input label={t('fields.role')} value={proj.role} onChange={(e) => update(proj.id, { role: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label={t('fields.url')} value={proj.url} onChange={(e) => update(proj.id, { url: e.target.value })} />
            <Input label={t('fields.startDate')} value={proj.startDate} onChange={(e) => update(proj.id, { startDate: e.target.value })} placeholder="2023-01" />
            <Input label={t('fields.endDate')} value={proj.endDate} onChange={(e) => update(proj.id, { endDate: e.target.value })} placeholder={t('fields.present')} />
          </div>
          <TextArea label={t('fields.description')} value={proj.description} onChange={(e) => update(proj.id, { description: e.target.value })} rows={2} />
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">{t('fields.highlights')}</label>
            {proj.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={h}
                  onChange={(e) => updateHighlight(proj.id, i, e.target.value)}
                />
                <Button variant="danger" size="sm" onClick={() => removeHighlight(proj.id, i)}>
                  &times;
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => addHighlight(proj.id)}>
              + {t('actions.addHighlight')}
            </Button>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addNew}>
        + {t('actions.add')}{t('editor.projects')}
      </Button>
    </div>
  );
}
