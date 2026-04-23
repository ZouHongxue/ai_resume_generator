import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import type { Certification } from '../../types/resume';

export default function CertificationsForm() {
  const { t } = useTranslation();
  const certifications = useResumeStore((s) => s.resume.certifications);
  const add = useResumeStore((s) => s.addCertification);
  const remove = useResumeStore((s) => s.removeCertification);
  const update = useResumeStore((s) => s.updateCertification);

  const addNew = () => {
    const item: Certification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      url: '',
    };
    add(item);
  };

  return (
    <div className="space-y-4">
      {certifications.map((cert) => (
        <div key={cert.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {cert.name || t('editor.certifications')}
            </span>
            <Button variant="danger" size="sm" onClick={() => remove(cert.id)}>
              {t('actions.remove')}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('fields.certName')} value={cert.name} onChange={(e) => update(cert.id, { name: e.target.value })} />
            <Input label={t('fields.issuer')} value={cert.issuer} onChange={(e) => update(cert.id, { issuer: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('fields.date')} value={cert.date} onChange={(e) => update(cert.id, { date: e.target.value })} placeholder="2024-01" />
            <Input label={t('fields.url')} value={cert.url} onChange={(e) => update(cert.id, { url: e.target.value })} />
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addNew}>
        + {t('actions.add')}{t('editor.certifications')}
      </Button>
    </div>
  );
}
