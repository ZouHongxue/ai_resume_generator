import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import FileUploader from './FileUploader';
import { parseFile } from '../../lib/parsers';
import { extractResume } from '../../lib/extraction';
import { useResumeStore } from '../../store/resumeStore';
import { useSettingsStore } from '../../store/settingsStore';
import type { ExtractionMode } from '../../types/extraction';
import type { ResumeData } from '../../types/resume';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportModal({ open, onClose }: ImportModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ExtractionMode>('rule');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Partial<ResumeData> | null>(null);
  const [extractionMode, setExtractionMode] = useState<ExtractionMode | null>(null);
  const setResume = useResumeStore((s) => s.setResume);
  const resume = useResumeStore((s) => s.resume);
  const { aiConfig, setAiConfig } = useSettingsStore();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError('');
    setPreview(null);
    try {
      const parsed = await parseFile(file);
      const config = mode === 'ai' ? aiConfig : undefined;
      const result = await extractResume(parsed.text, mode, config);
      setPreview(result.data);
      setExtractionMode(result.mode);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('import.failed');
      if (mode === 'ai') {
        setError(`${t('import.aiFailed')}: ${msg}`);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!preview) return;
    const merged: ResumeData = {
      ...resume,
      ...preview,
      meta: {
        ...resume.meta,
        ...(preview.meta || {}),
        updatedAt: new Date().toISOString(),
      },
      personalInfo: {
        ...resume.personalInfo,
        ...(preview.personalInfo || {}),
      },
    };
    setResume(merged);
    setPreview(null);
    onClose();
  };

  const handleClose = () => {
    setPreview(null);
    setError('');
    setExtractionMode(null);
    onClose();
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult('');
    try {
      const base = aiConfig.baseUrl.replace(/\/+$/, '');
      if (aiConfig.provider === 'ollama') {
        const res = await fetch(`${base}/api/tags`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        const models = (data.models || []).map((m: { name: string }) => m.name);
        const hasModel = models.some((n: string) => n === aiConfig.model || n.startsWith(aiConfig.model + ':'));
        setTestResult(hasModel
          ? t('import.testOk')
          : `${t('import.testOk')} (${t('import.modelNotFound')}: ${models.join(', ')})`
        );
      } else {
        if (!aiConfig.apiKey) return;
        const res = await fetch(`${base.replace(/\/v1$/, '')}/v1/models`, {
          headers: { Authorization: `Bearer ${aiConfig.apiKey}` },
        });
        setTestResult(res.ok ? t('import.testOk') : `Error: ${res.status}`);
      }
    } catch {
      setTestResult(t('import.testFail'));
    } finally {
      setTesting(false);
    }
  };

  const aiReady = mode === 'ai' && (aiConfig.provider === 'ollama' || aiConfig.apiKey.length > 0);

  return (
    <Modal open={open} onClose={handleClose} title={t('import.title')} wide>
      {!preview ? (
        <div className="space-y-4">
          {/* Mode selector */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              {t('import.extractMode')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('rule')}
                className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'rule'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold">{t('import.ruleMode')}</div>
                <div className="text-xs font-normal mt-0.5 opacity-70">{t('import.ruleModeDesc')}</div>
              </button>
              <button
                onClick={() => setMode('ai')}
                className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'ai'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold">{t('import.aiMode')}</div>
                <div className="text-xs font-normal mt-0.5 opacity-70">{t('import.aiModeDesc')}</div>
              </button>
            </div>
          </div>

          {/* AI config panel */}
          {mode === 'ai' && (
            <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-3 space-y-3">
              <h4 className="text-xs font-semibold text-gray-700">{t('settings.aiConfig')}</h4>

              {/* Provider selector */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">{t('settings.provider')}</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAiConfig({ provider: 'ollama', baseUrl: 'http://localhost:11434', model: 'llama3:8b' })}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      aiConfig.provider === 'ollama'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Ollama ({t('settings.local')})
                  </button>
                  <button
                    onClick={() => setAiConfig({ provider: 'openai', baseUrl: 'https://api.openai.com', model: 'gpt-4o-mini' })}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      aiConfig.provider === 'openai'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    OpenAI / {t('settings.compatible')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={t('settings.baseUrl')}
                  value={aiConfig.baseUrl}
                  onChange={(e) => setAiConfig({ baseUrl: e.target.value })}
                />
                <Input
                  label={t('settings.model')}
                  value={aiConfig.model}
                  onChange={(e) => setAiConfig({ model: e.target.value })}
                />
              </div>

              {/* API Key only for OpenAI-compatible */}
              {aiConfig.provider === 'openai' && (
                <Input
                  label={t('settings.apiKey')}
                  type="password"
                  value={aiConfig.apiKey}
                  onChange={(e) => setAiConfig({ apiKey: e.target.value })}
                  placeholder={t('settings.apiKeyPlaceholder')}
                />
              )}

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={testConnection}
                  disabled={testing || (aiConfig.provider === 'openai' && !aiConfig.apiKey)}
                >
                  {testing ? '...' : t('settings.testConnection')}
                </Button>
                {testResult && (
                  <span
                    className={`text-xs ${
                      testResult.startsWith(t('import.testOk')) ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {testResult}
                  </span>
                )}
                {aiConfig.provider === 'openai' && !aiConfig.apiKey && (
                  <span className="text-xs text-amber-600">{t('import.aiNeedKey')}</span>
                )}
              </div>
            </div>
          )}

          {/* File uploader */}
          <FileUploader
            onFileSelect={handleFileSelect}
            loading={loading}
            disabled={mode === 'ai' && !aiReady}
          />
          {mode === 'ai' && !aiReady && aiConfig.provider === 'openai' && (
            <p className="text-xs text-amber-600">{t('import.aiNeedKey')}</p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-800">{t('import.reviewTitle')}</h3>
              <p className="text-xs text-gray-500">{t('import.reviewDesc')}</p>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                extractionMode === 'ai'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {extractionMode === 'ai' ? t('import.aiMode') : t('import.ruleMode')}
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-3 text-xs font-mono space-y-2">
            {preview.personalInfo?.name && (
              <p><strong>{t('fields.name')}:</strong> {preview.personalInfo.name}</p>
            )}
            {preview.personalInfo?.email && (
              <p><strong>{t('fields.email')}:</strong> {preview.personalInfo.email}</p>
            )}
            {preview.personalInfo?.phone && (
              <p><strong>{t('fields.phone')}:</strong> {preview.personalInfo.phone}</p>
            )}
            {preview.personalInfo?.title && (
              <p><strong>{t('fields.title')}:</strong> {preview.personalInfo.title}</p>
            )}
            {preview.summary && (
              <p>
                <strong>{t('editor.summary')}:</strong>{' '}
                {preview.summary.length > 200
                  ? preview.summary.slice(0, 200) + '...'
                  : preview.summary}
              </p>
            )}
            {(preview.education?.length ?? 0) > 0 && (
              <p>
                <strong>{t('editor.education')}:</strong>{' '}
                {preview.education?.map((e) => e.institution).filter(Boolean).join(', ')}
              </p>
            )}
            {(preview.workExperience?.length ?? 0) > 0 && (
              <p>
                <strong>{t('editor.workExperience')}:</strong>{' '}
                {preview.workExperience
                  ?.map((e) => [e.company, e.position].filter(Boolean).join(' - '))
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {(preview.skills?.length ?? 0) > 0 && (
              <p>
                <strong>{t('editor.skills')}:</strong>{' '}
                {preview.skills?.flatMap((s) => s.items).join(', ')}
              </p>
            )}
            {(preview.projects?.length ?? 0) > 0 && (
              <p>
                <strong>{t('editor.projects')}:</strong>{' '}
                {preview.projects?.map((p) => p.name).filter(Boolean).join(', ')}
              </p>
            )}
            {(preview.certifications?.length ?? 0) > 0 && (
              <p>
                <strong>{t('editor.certifications')}:</strong>{' '}
                {preview.certifications?.map((c) => c.name).filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setPreview(null); setExtractionMode(null); }}>
              {t('actions.cancel')}
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              {t('actions.confirm')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
