import { useTranslation } from 'react-i18next';
import PersonalInfoForm from './PersonalInfoForm';
import SummaryForm from './SummaryForm';
import EducationForm from './EducationForm';
import WorkExperienceForm from './WorkExperienceForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import CertificationsForm from './CertificationsForm';
import CustomSectionForm from './CustomSectionForm';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import type { SectionKey } from '../../types/resume';
import { DEFAULT_SECTION_ORDER } from '../../types/resume';
import { useState } from 'react';

const SECTION_COMPONENTS: Record<SectionKey, React.FC> = {
  personalInfo: PersonalInfoForm,
  summary: SummaryForm,
  education: EducationForm,
  workExperience: WorkExperienceForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
  customSections: CustomSectionForm,
};

export default function ResumeEditor() {
  const { t } = useTranslation();
  const sectionOrder = useResumeStore((s) => s.resume.meta.sectionOrder) || DEFAULT_SECTION_ORDER;
  const updateMeta = useResumeStore((s) => s.updateMeta);
  const [activeSection, setActiveSection] = useState<SectionKey>('personalInfo');
  const [reordering, setReordering] = useState(false);

  const moveSection = (index: number, direction: -1 | 1) => {
    const newOrder = [...sectionOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    updateMeta({ sectionOrder: newOrder });
  };

  const ActiveComponent = SECTION_COMPONENTS[activeSection];

  return (
    <div className="flex flex-col h-full">
      {/* Section tabs with reorder toggle */}
      <div className="border-b border-gray-200 px-2 pt-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1" />
          <button
            onClick={() => setReordering(!reordering)}
            className={`text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
              reordering ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {reordering ? t('editor.doneReorder') : t('editor.reorder')}
          </button>
        </div>

        {reordering ? (
          /* Reorder mode: vertical list with move buttons */
          <div className="space-y-1 pb-2">
            {sectionOrder.map((key, index) => (
              <div key={key} className="flex items-center gap-1.5 px-1">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none cursor-pointer"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveSection(index, 1)}
                    disabled={index === sectionOrder.length - 1}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none cursor-pointer"
                  >
                    ▼
                  </button>
                </div>
                <span className="text-xs text-gray-700 font-medium">
                  {index + 1}. {t(`editor.${key}`)}
                </span>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => updateMeta({ sectionOrder: [...DEFAULT_SECTION_ORDER] })}>
              {t('editor.resetOrder')}
            </Button>
          </div>
        ) : (
          /* Normal mode: horizontal tabs */
          <div className="flex gap-0.5 overflow-x-auto">
            {sectionOrder.map((key) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeSection === key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t(`editor.${key}`)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active section form */}
      {!reordering && (
        <div className="flex-1 overflow-y-auto p-4">
          <ActiveComponent />
        </div>
      )}
    </div>
  );
}
