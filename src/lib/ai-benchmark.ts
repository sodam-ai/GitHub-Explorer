export interface BenchmarkResult {
  model: string;
  provider: string;
  responseTime: number;
  tokenCount: number;
  quality: 'good' | 'fair' | 'poor';
  error?: string;
}

export async function benchmarkModel(
  prompt: string,
  provider: 'openai' | 'ollama',
  model: string,
  apiKey?: string,
  ollamaEndpoint = 'http://localhost:11434'
): Promise<BenchmarkResult> {
  const start = performance.now();

  try {
    let response = '';

    if (provider === 'openai') {
      if (!apiKey) throw new Error('API 키 없음');
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      response = data.choices[0]?.message?.content || '';
    } else {
      const res = await fetch(`${ollamaEndpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        }),
      });
      if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
      const data = await res.json();
      response = data.message?.content || '';
    }

    const elapsed = performance.now() - start;
    const tokenCount = response.split(/\s+/).length;
    const quality = tokenCount > 30 ? 'good' : tokenCount > 10 ? 'fair' : 'poor';

    return { model, provider, responseTime: Math.round(elapsed), tokenCount, quality };
  } catch (error) {
    return {
      model,
      provider,
      responseTime: Math.round(performance.now() - start),
      tokenCount: 0,
      quality: 'poor',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
}
