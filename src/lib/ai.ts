import type { Repository } from '@/types';

export async function generateSearchSummary(
  query: string,
  repositories: Repository[],
  apiKey: string
): Promise<string> {
  if (!apiKey) return '검색 결과를 찾았습니다. AI 요약을 사용하려면 설정에서 API 키를 입력하세요.';

  const repoList = repositories
    .slice(0, 5)
    .map((r) => `${r.full_name} (⭐${r.stars}) - ${r.description || '설명 없음'}`)
    .join('\n');

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '당신은 GitHub 저장소 검색 결과를 한국어로 요약하는 AI입니다. 2~3문장으로 핵심을 요약하세요. 가장 추천하는 저장소와 이유를 포함하세요.',
          },
          {
            role: 'user',
            content: `검색어: "${query}"\n\n검색 결과:\n${repoList}\n\n이 결과를 2~3문장으로 요약해주세요.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error?.message || `OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || '요약을 생성할 수 없습니다.';
  } catch (error) {
    console.error('AI summary error:', error);
    return `검색 결과 ${repositories.length}개를 찾았습니다. (AI 요약 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'})`;
  }
}
