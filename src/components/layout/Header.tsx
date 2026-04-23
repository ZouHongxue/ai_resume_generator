import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Button from '../common/Button';

interface HeaderProps {
  onImport: () => void;
  onSettings: () => void;
  onNewResume: () => void;
}

export default function Header({ onImport, onSettings, onNewResume }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white no-print">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-gray-900">{t('app.title')}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onNewResume}>
          {t('nav.newResume')}
        </Button>
        <Button variant="secondary" size="sm" onClick={onImport}>
          {t('nav.import')}
        </Button>
        <Button variant="ghost" size="sm" onClick={onSettings}>
          {t('nav.settings')}
        </Button>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
