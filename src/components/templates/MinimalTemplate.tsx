import type { TemplateProps } from '../../types/template';
import type { SectionKey } from '../../types/resume';
import { DEFAULT_SECTION_ORDER } from '../../types/resume';
import { formatDateRange } from '../../lib/formatDate';
import { getSpacing } from '../../lib/contentDensity';

export default function MinimalTemplate({ data, className = '' }: TemplateProps) {
  const { personalInfo, education, workExperience, skills, projects, certifications, customSections } = data;
  const isZh = data.meta.language === 'zh';
  const order = data.meta.sectionOrder || DEFAULT_SECTION_ORDER;
  const present = isZh ? '至今' : 'Present';
  const sp = getSpacing(data);

  const sections: Record<SectionKey, React.ReactNode> = {
    personalInfo: (
      <div className={sp.sectionGap}>
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">{personalInfo.name || 'Your Name'}</h1>
        {personalInfo.title && <p className="text-sm text-gray-400 mt-1 font-light">{personalInfo.title}</p>}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-3 text-xs text-gray-400">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>
    ),

    summary: data.summary ? (
      <section className={sp.sectionGap}>
        <p className={`${sp.bodySize} ${sp.lineHeight} text-gray-600`}>{data.summary}</p>
      </section>
    ) : null,

    workExperience: workExperience.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
          {isZh ? '工作经历' : 'Experience'}
        </h2>
        {workExperience.map((exp) => {
          const dateStr = formatDateRange(exp.startDate, exp.endDate, present);
          return (
            <div key={exp.id} className={sp.itemGap}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className={`${sp.bodySize} font-medium text-gray-900`}>{exp.position}</span>
                  <span className="text-xs text-gray-400 ml-2">{exp.company}</span>
                </div>
                {dateStr && <span className="text-[10px] text-gray-400">{dateStr}</span>}
              </div>
              {exp.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-1.5 space-y-1">
                  {exp.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className={`text-xs text-gray-500 ${sp.lineHeight} pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300`}>
                      {h}
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
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
          {isZh ? '项目经验' : 'Projects'}
        </h2>
        {projects.map((proj) => {
          const dateStr = formatDateRange(proj.startDate, proj.endDate);
          return (
            <div key={proj.id} className={sp.itemGap}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className={`${sp.bodySize} font-medium text-gray-900`}>{proj.name}</span>
                  {proj.role && <span className="text-xs text-gray-400 ml-2">{proj.role}</span>}
                </div>
                {dateStr && <span className="text-[10px] text-gray-400">{dateStr}</span>}
              </div>
              {proj.description && <p className={`text-xs text-gray-500 mt-1 ${sp.lineHeight}`}>{proj.description}</p>}
              {proj.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-1.5 space-y-1">
                  {proj.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className={`text-xs text-gray-500 ${sp.lineHeight} pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300`}>
                      {h}
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
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
          {isZh ? '教育经历' : 'Education'}
        </h2>
        {education.map((edu) => {
          const dateStr = formatDateRange(edu.startDate, edu.endDate);
          return (
            <div key={edu.id} className={`${sp.itemGap} flex justify-between items-baseline`}>
              <div>
                <span className={`${sp.bodySize} font-medium text-gray-900`}>{edu.institution}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {edu.degree}{edu.field && ` · ${edu.field}`}
                </span>
              </div>
              {dateStr && <span className="text-[10px] text-gray-400">{dateStr}</span>}
            </div>
          );
        })}
      </section>
    ) : null,

    skills: skills.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
          {isZh ? '专业技能' : 'Skills'}
        </h2>
        <div className="space-y-1.5">
          {skills.map((skill) => (
            <div key={skill.id} className={`${sp.bodySize} text-gray-600 ${sp.lineHeight}`}>
              {skill.category && (
                <>
                  <span className="text-gray-900 font-medium">{skill.category}</span>
                  <span className="text-gray-300 mx-2">|</span>
                </>
              )}
              {skill.items.join(' · ')}
            </div>
          ))}
        </div>
      </section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
          {isZh ? '证书资质' : 'Certifications'}
        </h2>
        <div className="space-y-1">
          {certifications.map((cert) => (
            <div key={cert.id} className={`${sp.bodySize} flex justify-between`}>
              <span className="text-gray-700">{cert.name}<span className="text-gray-400"> — {cert.issuer}</span></span>
              {cert.date && <span className="text-gray-400">{cert.date}</span>}
            </div>
          ))}
        </div>
      </section>
    ) : null,

    customSections: customSections.length > 0 ? (
      <>
        {customSections.map((section) => (
          <section key={section.id} className={sp.sectionGap}>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
              {section.title}
            </h2>
            <p className={`${sp.bodySize} ${sp.lineHeight} text-gray-600 whitespace-pre-wrap`}>{section.content}</p>
          </section>
        ))}
      </>
    ) : null,
  };

  return (
    <div className={`a4-page ${className}`} style={{ fontFamily: '"Inter", "Noto Sans SC", sans-serif', padding: sp.pagePadding }}>
      {order.map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
    </div>
  );
}
