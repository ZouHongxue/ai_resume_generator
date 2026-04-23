import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../store/settingsStore';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  const toggle = () => {
    const next = language === 'zh' ? 'en' : 'zh';
    setLanguage(next);
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
    >
      {language === 'zh' ? 'EN' : '中文'}
    </button>
  );
}
