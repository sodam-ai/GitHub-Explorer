import { getSecret } from './tauri-bridge';
import { generateWithOllama } from './ollama';

export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'ollama' | 'lmstudio';

export interface ChatMessage {
  role: string;
  content: string;
}

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
  ollamaModel?: string;
  endpoint?: string;
}

export const DEFAULT_MODELS: Record<LLMProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20241022',
  gemini: 'gemini-2.5-flash',
  groq: 'llama-3.3-70b-versatile',
  ollama: '',
  lmstudio: 'local-model',
};

const DEFAULT_ENDPOINTS: Partial<Record<LLMProvider, string>> = {
  ollama: 'http://localhost:11434',
  lmstudio: 'http://localhost:1234/v1',
};

const SECRET_KEY_BY_PROVIDER: Partial<Record<LLMProvider, string>> = {
  openai: 'openai_api_key',
  anthropic: 'anthropic_api_key',
  gemini: 'gemini_api_key',
  groq: 'groq_api_key',
};

export function isConfigured(config: LLMConfig): boolean {
  if (config.provider === 'ollama' || config.provider === 'lmstudio') return true;
  return !!config.apiKey;
}

interface AiSettingsSnapshot {
  aiProvider: LLMProvider;
  ollamaModel: string;
  aiModelOverride: string;
}

export async function buildLLMConfig(settings: AiSettingsSnapshot): Promise<LLMConfig> {
  const secretKey = SECRET_KEY_BY_PROVIDER[settings.aiProvider];
  const apiKey = secretKey ? (await getSecret(secretKey)) || undefined : undefined;
  return {
    provider: settings.aiProvider,
    apiKey,
    ollamaModel: settings.ollamaModel,
    model: settings.aiModelOverride || undefined,
  };
}

export async function chatComplete(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string,
  history: ChatMessage[] = [],
  maxTokens = 500
): Promise<string> {
  switch (config.provider) {
    case 'openai':
      return openaiCompatibleChat(
        'https://api.openai.com/v1',
        config.apiKey || '',
        config.model || DEFAULT_MODELS.openai,
        systemPrompt, userPrompt, history, maxTokens
      );
    case 'groq':
      return openaiCompatibleChat(
        'https://api.groq.com/openai/v1',
        config.apiKey || '',
        config.model || DEFAULT_MODELS.groq,
        systemPrompt, userPrompt, history, maxTokens
      );
    case 'lmstudio':
      return openaiCompatibleChat(
        config.endpoint || DEFAULT_ENDPOINTS.lmstudio!,
        config.apiKey || 'lm-studio',
        config.model || DEFAULT_MODELS.lmstudio,
        systemPrompt, userPrompt, history, maxTokens
      );
    case 'anthropic':
      return anthropicChat(
        config.apiKey || '',
        config.model || DEFAULT_MODELS.anthropic,
        systemPrompt, userPrompt, history, maxTokens
      );
    case 'gemini':
      return geminiChat(
        config.apiKey || '',
        config.model || DEFAULT_MODELS.gemini,
        systemPrompt, userPrompt, history, maxTokens
      );
    case 'ollama': {
      const combined = history.length
        ? `${history.map((m) => `${m.role}: ${m.content}`).join('\n')}\nuser: ${userPrompt}`
        : userPrompt;
      return generateWithOllama(
        combined,
        config.ollamaModel || '',
        systemPrompt,
        config.endpoint || DEFAULT_ENDPOINTS.ollama
      );
    }
    default:
      throw new Error(`지원하지 않는 AI 제공자: ${config.provider}`);
  }
}

async function openaiCompatibleChat(
  baseUrl: string, apiKey: string, model: string,
  systemPrompt: string, userPrompt: string, history: ChatMessage[], maxTokens: number
): Promise<string> {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6),
    { role: 'user', content: userPrompt },
  ];

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.5 }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || `API 오류: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function anthropicChat(
  apiKey: string, model: string,
  systemPrompt: string, userPrompt: string, history: ChatMessage[], maxTokens: number
): Promise<string> {
  const messages = [...history.slice(-6), { role: 'user', content: userPrompt }].map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model, system: systemPrompt, messages, max_tokens: maxTokens }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || `Anthropic API 오류: ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function geminiChat(
  apiKey: string, model: string,
  systemPrompt: string, userPrompt: string, history: ChatMessage[], maxTokens: number
): Promise<string> {
  const contents = [
    ...history.slice(-6).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userPrompt }] },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.5 },
      }),
      signal: AbortSignal.timeout(60000),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || `Gemini API 오류: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
