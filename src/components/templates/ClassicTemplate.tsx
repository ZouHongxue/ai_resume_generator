import type { TemplateProps } from '../../types/template';
import type { SectionKey } from '../../types/resume';
import { DEFAULT_SECTION_ORDER } from '../../types/resume';
import { formatDateRange } from '../../lib/formatDate';
import { getSpacing } from '../../lib/contentDensity';

export default function ClassicTemplate({ data, className = '' }: TemplateProps) {
  const { personalInfo, education, workExperience, skills, projects, certifications, customSections } = data;
  const isZh = data.meta.language === 'zh';
  const order = data.meta.sectionOrder || DEFAULT_SECTION_ORDER;
  const present = isZh ? '至今' : 'Present';
  const sp = getSpacing(data);

  const sections: Record<SectionKey, React.ReactNode> = {
    personalInfo: (
      <div className={`text-center ${sp.sectionGap} pb-4 border-b-2 border-gray-800`}>
        <h1 className="text-2xl font-bold tracking-wide">{personalInfo.name || 'Your Name'}</h1>
        {personalInfo.title && <p className={`${sp.bodySize} text-gray-600 mt-1`}>{personalInfo.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
    ),

    summary: data.summary ? (
      <section className={sp.sectionGap}>
        <h2 className={`${sp.bodySize} font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3`}>
          {isZh ? '个人简介' : 'Summary'}
        </h2>
        <p className={`${sp.bodySize} ${sp.lineHeight}`}>{data.summary}</p>
      </section>
    ) : null,

    workExperience: workExperience.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className={`${sp.bodySize} font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3`}>
          {isZh ? '工作经历' : 'Work Experience'}
        </h2>
        {workExperience.map((exp) => {
          const dateStr = formatDateRange(exp.startDate, exp.endDate, present);
          return (
            <div key={exp.id} className={sp.itemGap}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className={`font-bold ${sp.bodySize}`}>{exp.company}</span>
                  {exp.position && <span className={`${sp.bodySize} text-gray-600`}> — {exp.position}</span>}
                </div>
                {dateStr && <span className="text-xs text-gray-500 whitespace-nowrap">{dateStr}</span>}
              </div>
              {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
              {exp.highlights.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {exp.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className={`text-xs ${sp.lineHeight}`}>{h}</li>
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
        <h2 className={`${sp.bodySize} font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3`}>
          {isZh ? '项目经验' : 'Projects'}
        </h2>
        {projects.map((proj) => {
          const dateStr = formatDateRange(proj.startDate, proj.endDate);
          return (
            <div key={proj.id} className={sp.itemGap}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className={`font-bold ${sp.bodySize}`}>{proj.name}</span>
                  {proj.role && <span className={`${sp.bodySize} text-gray-600`}> — {proj.role}</span>}
                </div>
                {dateStr && <span className="text-xs text-gray-500 whitespace-nowrap">{dateStr}</span>}
              </div>
              {proj.description && <p className={`text-xs mt-0.5 ${sp.lineHeight}`}>{proj.description}</p>}
              {proj.highlights.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {proj.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className={`text-xs ${sp.lineHeight}`}>{h}</li>
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
        <h2 className={`${sp.bodySize} font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3`}>
          {isZh ? '教育经历' : 'Education'}
        </h2>
        {education.map((edu) => {
          const dateStr = formatDateRange(edu.startDate, edu.endDate);
          return (
            <div key={edu.id} className={sp.itemGap}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className={`font-bold ${sp.bodySize}`}>{edu.institution}</span>
                  {edu.degree && <span className={`${sp.bodySize} text-gray-600`}> — {edu.degree}{edu.field && `, ${edu.field}`}</span>}
                </div>
                {dateStr && <span className="text-xs text-gray-500 whitespace-nowrap">{dateStr}</span>}
              </div>
              {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
              {edu.description && <p className={`text-xs mt-0.5 ${sp.lineHeight}`}>{edu.description}</p>}
            </div>
          );
        })}
      </section>
    ) : null,

    skills: skills.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className={`${sp.bodySize} font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3`}>
          {isZh ? '专业技能' : 'Skills'}
        </h2>
        <div className="space-y-1">
          {skills.map((skill) => (
            <div key={skill.id} className={`${sp.bodySize} ${sp.lineHeight}`}>
              {skill.category && <span className="font-semibold">{skill.category}: </span>}
              <span>{skill.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <section className={sp.sectionGap}>
        <h2 className={`${sp.bodySize} font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3`}>
          {isZh ? '证书资质' : 'Certifications'}
        </h2>
        <div className="space-y-1">
          {certifications.map((cert) => (
            <div key={cert.id} className={`flex justify-between ${sp.bodySize}`}>
              <span>
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
              </span>
              {cert.date && <span className="text-gray-500">{cert.date}</span>}
            </div>
          ))}
        </div>
      </section>
    ) : null,

    customSections: customSections.length > 0 ? (
      <>
        {customSections.map((section) => (
          <section key={section.id} className={sp.sectionGap}>
            <h2 className={`${sp.bodySize} font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3`}>
              {section.title}
            </h2>
            <p className={`${sp.bodySize} ${sp.lineHeight} whitespace-pre-wrap`}>{section.content}</p>
          </section>
        ))}
      </>
    ) : null,
  };

  return (
    <div className={`a4-page font-serif text-gray-900 ${className}`} style={{ fontFamily: '"Georgia", "Noto Serif SC", serif', padding: sp.pagePadding }}>
      {order.map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
    </div>
  );
}
