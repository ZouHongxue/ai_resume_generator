import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AiConfig } from '../types/extraction';

interface SettingsState {
  aiConfig: AiConfig;
  setAiConfig: (config: Partial<AiConfig>) => void;
  hasApiKey: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      aiConfig: {
        provider: 'ollama',
        apiKey: '',
        baseUrl: 'http://localhost:11434',
        model: 'llama3:8b',
      },
      setAiConfig: (config) =>
        set((state) => ({
          aiConfig: { ...state.aiConfig, ...config },
        })),
      hasApiKey: () => get().aiConfig.apiKey.length > 0,
    }),
    {
      name: 'app-settings',
      version: 2,
      migrate: (persisted: unknown) => {
        const state = persisted as Record<string, unknown>;
        const aiConfig = (state?.aiConfig || {}) as Record<string, unknown>;
        if (!aiConfig.provider) {
          aiConfig.provider = 'ollama';
          aiConfig.baseUrl = aiConfig.baseUrl || 'http://localhost:11434';
          aiConfig.model = aiConfig.model || 'llama3:8b';
        }
        return { ...state, aiConfig };
      },
    },
  ),
);
