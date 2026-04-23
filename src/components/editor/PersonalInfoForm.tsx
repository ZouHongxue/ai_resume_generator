import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import { useResumeStore } from '../../store/resumeStore';

export default function PersonalInfoForm() {
  const { t } = useTranslation();
  const personalInfo = useResumeStore((s) => s.resume.personalInfo);
  const update = useResumeStore((s) => s.updatePersonalInfo);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label={t('fields.name')} value={personalInfo.name} onChange={(e) => update({ name: e.target.value })} />
        <Input label={t('fields.title')} value={personalInfo.title} onChange={(e) => update({ title: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label={t('fields.email')} type="email" value={personalInfo.email} onChange={(e) => update({ email: e.target.value })} />
        <Input label={t('fields.phone')} value={personalInfo.phone} onChange={(e) => update({ phone: e.target.value })} />
      </div>
      <Input label={t('fields.location')} value={personalInfo.location} onChange={(e) => update({ location: e.target.value })} />
      <div className="grid grid-cols-3 gap-3">
        <Input label={t('fields.website')} value={personalInfo.website} onChange={(e) => update({ website: e.target.value })} />
        <Input label={t('fields.linkedin')} value={personalInfo.linkedin} onChange={(e) => update({ linkedin: e.target.value })} />
        <Input label={t('fields.github')} value={personalInfo.github} onChange={(e) => update({ github: e.target.value })} />
      </div>
    </div>
  );
}
