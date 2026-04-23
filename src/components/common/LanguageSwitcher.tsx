import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');

  const toggle = () => {
    i18n.changeLanguage(isZh ? 'en' : 'zh');
  };

  return (
    <button
      onClick={toggle}
      className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
    >
      {isZh ? 'EN' : '中文'}
    </button>
  );
}
