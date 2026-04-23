import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import type { Skill } from '../../types/resume';

export default function SkillsForm() {
  const { t } = useTranslation();
  const skills = useResumeStore((s) => s.resume.skills);
  const add = useResumeStore((s) => s.addSkill);
  const remove = useResumeStore((s) => s.removeSkill);
  const update = useResumeStore((s) => s.updateSkill);
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});

  const addNew = () => {
    const item: Skill = {
      id: crypto.randomUUID(),
      category: '',
      items: [],
    };
    add(item);
  };

  const addItem = (skillId: string) => {
    const text = newItemText[skillId]?.trim();
    if (!text) return;
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return;
    update(skillId, { items: [...skill.items, text] });
    setNewItemText((prev) => ({ ...prev, [skillId]: '' }));
  };

  const removeItem = (skillId: string, index: number) => {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return;
    update(skillId, { items: skill.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {skill.category || t('editor.skills')}
            </span>
            <Button variant="danger" size="sm" onClick={() => remove(skill.id)}>
              {t('actions.remove')}
            </Button>
          </div>
          <Input
            label={t('fields.category')}
            value={skill.category}
            onChange={(e) => update(skill.id, { category: e.target.value })}
            placeholder="e.g. Programming Languages"
          />
          <div>
            <label className="text-xs font-medium text-gray-600">{t('fields.items')}</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {skill.items.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
                >
                  {item}
                  <button
                    onClick={() => removeItem(skill.id, i)}
                    className="text-blue-400 hover:text-blue-600 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={newItemText[skill.id] || ''}
                onChange={(e) => setNewItemText((prev) => ({ ...prev, [skill.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addItem(skill.id)}
                placeholder={t('actions.addItem')}
              />
              <Button variant="ghost" size="sm" onClick={() => addItem(skill.id)}>
                +
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addNew}>
        + {t('actions.add')}{t('editor.skills')}
      </Button>
    </div>
  );
}
