export interface OllamaModel {
  name: string;
  size: string;
  modified_at: string;
}

export async function checkOllamaStatus(endpoint = 'http://localhost:11434'): Promise<boolean> {
  try {
    const res = await fetch(`${endpoint}/api/tags`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getOllamaModels(endpoint = 'http://localhost:11434'): Promise<OllamaModel[]> {
  try {
    const res = await fetch(`${endpoint}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map((m: Record<string, unknown>) => ({
      name: m.name as string,
      size: formatSize(m.size as number),
      modified_at: m.modified_at as string,
    }));
  } catch {
    return [];
  }
}

export async function generateWithOllama(
  prompt: string,
  model: string,
  systemPrompt?: string,
  endpoint = 'http://localhost:11434'
): Promise<string> {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(`${endpoint}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status}`);
  }

  const data = await res.json();
  return data.message?.content || '';
}

function formatSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)}GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)}MB`;
  return `${bytes}B`;
}
