import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { useResumeStore } from '../../store/resumeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { generateSummary } from '../../lib/extraction/summaryGenerator';

export default function SummaryForm() {
  const { t } = useTranslation();
  const summary = useResumeStore((s) => s.resume.summary);
  const setSummary = useResumeStore((s) => s.setSummary);
  const resume = useResumeStore((s) => s.resume);
  const aiConfig = useSettingsStore((s) => s.aiConfig);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const result = await generateSummary(resume, aiConfig);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('editor.generateFailed'));
    } finally {
      setGenerating(false);
    }
  };

  const hasContent = resume.workExperience.length > 0 || resume.education.length > 0 || resume.skills.length > 0 || resume.projects.length > 0;
  const aiAvailable = aiConfig.provider === 'ollama' || aiConfig.apiKey.length > 0;

  return (
    <div className="space-y-3">
      <TextArea
        label={t('fields.summary')}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={6}
        placeholder={t('editor.summaryPlaceholder')}
      />
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGenerate}
          disabled={generating || !hasContent || !aiAvailable}
        >
          {generating ? t('editor.generating') : t('editor.aiGenerate')}
        </Button>
        {!aiAvailable && (
          <span className="text-xs text-amber-600">{t('editor.aiGenerateNeedConfig')}</span>
        )}
        {!hasContent && aiAvailable && (
          <span className="text-xs text-gray-400">{t('editor.aiGenerateNeedContent')}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
