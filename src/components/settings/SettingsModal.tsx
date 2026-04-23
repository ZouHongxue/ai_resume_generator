import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useSettingsStore } from '../../store/settingsStore';
import { useState } from 'react';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const { aiConfig, setAiConfig } = useSettingsStore();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  const testConnection = async () => {
    setTesting(true);
    setTestResult('');
    try {
      const base = aiConfig.baseUrl.replace(/\/+$/, '');
      if (aiConfig.provider === 'ollama') {
        const res = await fetch(`${base}/api/tags`);
        setTestResult(res.ok ? t('import.testOk') : `Error: ${res.status}`);
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

  return (
    <Modal open={open} onClose={onClose} title={t('settings.title')}>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">{t('settings.aiConfig')}</h3>

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
            <span className={`text-xs ${testResult.startsWith(t('import.testOk')) ? 'text-green-600' : 'text-red-600'}`}>
              {testResult}
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}
