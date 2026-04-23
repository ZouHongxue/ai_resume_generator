import type { TemplateProps } from '../../types/template';
import type { SectionKey } from '../../types/resume';
import { DEFAULT_SECTION_ORDER } from '../../types/resume';
import { formatDateRange } from '../../lib/formatDate';
import { getSpacing } from '../../lib/contentDensity';

// Sidebar sections are always rendered in the sidebar
const SIDEBAR_SECTIONS = new Set<SectionKey>(['personalInfo', 'skills', 'certifications']);

export default function ModernTemplate({ data, className = '' }: TemplateProps) {
  const { personalInfo, education, workExperience, skills, projects, certifications, customSections } = data;
  const isZh = data.meta.language === 'zh';
  const order = data.meta.sectionOrder || DEFAULT_SECTION_ORDER;
  const mainOrder = order.filter((k) => !SIDEBAR_SECTIONS.has(k));
  const present = isZh ? '至今' : 'Present';
  const sp = getSpacing(data);

  const mainSections: Record<string, React.ReactNode> = {
    summary: data.summary ? (
      <section className={sp.sectionGap}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-2">
          {isZh ? '个人简介' : 'Profile'}
        </h2>
        <p className={`${sp.bodySize} ${sp.lineHeight} text-gray-700`}>{data.summary}</p>
      </section>
    ) : null,

    workExperience: workExperience.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-2">
          {isZh ? '工作经历' : 'Experience'}
        </h2>
        {workExperience.map((exp) => {
          const dateStr = formatDateRange(exp.startDate, exp.endDate, present);
          return (
            <div key={exp.id} className={sp.itemGap}>
              <div className="flex justify-between items-baseline">
                <p className={`${sp.bodySize} font-semibold text-gray-900`}>{exp.position}</p>
                {dateStr && <span className="text-[10px] text-gray-500">{dateStr}</span>}
              </div>
              <p className="text-xs text-blue-600">{exp.company}{exp.location && ` · ${exp.location}`}</p>
              {exp.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {exp.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className={`text-xs text-gray-600 flex gap-1.5 ${sp.lineHeight}`}>
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    ) : null,

    projects: projects.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-2">
          {isZh ? '项目经验' : 'Projects'}
        </h2>
        {projects.map((proj) => {
          const dateStr = formatDateRange(proj.startDate, proj.endDate);
          return (
            <div key={proj.id} className={sp.itemGap}>
              <div className="flex justify-between items-baseline">
                <p className={`${sp.bodySize} font-semibold text-gray-900`}>{proj.name}</p>
                {dateStr && <span className="text-[10px] text-gray-500">{dateStr}</span>}
              </div>
              {proj.role && <p className="text-xs text-blue-600">{proj.role}</p>}
              {proj.description && <p className={`text-xs text-gray-600 mt-0.5 ${sp.lineHeight}`}>{proj.description}</p>}
              {proj.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {proj.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className={`text-xs text-gray-600 flex gap-1.5 ${sp.lineHeight}`}>
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    ) : null,

    education: education.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-2">
          {isZh ? '教育经历' : 'Education'}
        </h2>
        {education.map((edu) => {
          const dateStr = formatDateRange(edu.startDate, edu.endDate);
          return (
            <div key={edu.id} className={sp.itemGap}>
              <div className="flex justify-between items-baseline">
                <p className={`${sp.bodySize} font-semibold text-gray-900`}>{edu.institution}</p>
                {dateStr && <span className="text-[10px] text-gray-500">{dateStr}</span>}
              </div>
              <p className="text-xs text-gray-600">
                {edu.degree}{edu.field && ` · ${edu.field}`}{edu.gpa && ` · GPA: ${edu.gpa}`}
              </p>
              {edu.description && <p className={`text-xs text-gray-500 mt-0.5 ${sp.lineHeight}`}>{edu.description}</p>}
            </div>
          );
        })}
      </section>
    ) : null,

    customSections: customSections.length > 0 ? (
      <>
        {customSections.map((section) => (
          <section key={section.id} className={sp.sectionGap}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-2">
              {section.title}
            </h2>
            <p className={`${sp.bodySize} ${sp.lineHeight} text-gray-700 whitespace-pre-wrap`}>{section.content}</p>
          </section>
        ))}
      </>
    ) : null,
  };

  return (
    <div className={`a4-page flex gap-0 p-0 ${className}`} style={{ fontFamily: '"Inter", "Noto Sans SC", sans-serif' }}>
      {/* Sidebar */}
      <div className="w-[70mm] bg-slate-800 text-white p-6 shrink-0">
        <div className="mb-6">
          <h1 className="text-xl font-bold leading-tight">{personalInfo.name || 'Your Name'}</h1>
          {personalInfo.title && <p className="text-xs text-slate-300 mt-1">{personalInfo.title}</p>}
        </div>

        <div className="space-y-1.5 mb-6">
          <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
            {isZh ? '联系方式' : 'Contact'}
          </h3>
          {personalInfo.email && <p className="text-xs break-all">{personalInfo.email}</p>}
          {personalInfo.phone && <p className="text-xs">{personalInfo.phone}</p>}
          {personalInfo.location && <p className="text-xs">{personalInfo.location}</p>}
          {personalInfo.website && <p className="text-xs break-all">{personalInfo.website}</p>}
          {personalInfo.github && <p className="text-xs break-all">{personalInfo.github}</p>}
          {personalInfo.linkedin && <p className="text-xs break-all">{personalInfo.linkedin}</p>}
        </div>

        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
              {isZh ? '专业技能' : 'Skills'}
            </h3>
            {skills.map((skill) => (
              <div key={skill.id} className="mb-2">
                {skill.category && <p className="text-xs font-semibold text-slate-200">{skill.category}</p>}
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.items.map((item, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
              {isZh ? '证书资质' : 'Certifications'}
            </h3>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1.5">
                <p className="text-xs font-semibold">{cert.name}</p>
                <p className="text-[10px] text-slate-400">{cert.issuer}{cert.date && ` · ${cert.date}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content - ordered */}
      <div className="flex-1 p-6">
        {mainOrder.map((key) => (
          <div key={key}>{mainSections[key]}</div>
        ))}
      </div>
    </div>
  );
}
