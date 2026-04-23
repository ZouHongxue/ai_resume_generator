import { useResumeStore } from '../../store/resumeStore';
import { getTemplate } from '../templates/TemplateRegistry';
import PreviewToolbar from './PreviewToolbar';

export default function ResumePreview() {
  const resume = useResumeStore((s) => s.resume);
  const { component: Template } = getTemplate(resume.meta.templateId);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <PreviewToolbar />
      <div className="transform origin-top scale-[0.6] md:scale-[0.75] lg:scale-[0.85]" style={{ marginBottom: '-15%' }}>
        <div id="resume-preview">
          <Template data={resume} />
        </div>
      </div>
    </div>
  );
}
