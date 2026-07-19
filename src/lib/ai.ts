import type { Repository } from '@/types';
import { chatComplete, isConfigured, type LLMConfig } from './llm-providers';

export async function generateSearchSummary(
  query: string,
  repositories: Repository[],
  config: LLMConfig
): Promise<string> {
  if (!isConfigured(config)) {
    return '검색 결과를 찾았습니다. AI 요약을 사용하려면 설정에서 API 키를 입력하세요.';
  }

  const repoList = repositories
    .slice(0, 5)
    .map((r) => `${r.full_name} (⭐${r.stars}) - ${r.description || '설명 없음'}`)
    .join('\n');

  const systemPrompt =
    '당신은 GitHub 저장소 검색 결과를 한국어로 요약하는 AI입니다. 2~3문장으로 핵심을 요약하세요. 가장 추천하는 저장소와 이유를 포함하세요.';
  const userPrompt = `검색어: "${query}"\n\n검색 결과:\n${repoList}\n\n이 결과를 2~3문장으로 요약해주세요.`;

  try {
    const summary = await chatComplete(config, systemPrompt, userPrompt, [], 200);
    return summary || '요약을 생성할 수 없습니다.';
  } catch (error) {
    console.error('AI summary error:', error);
    return `검색 결과 ${repositories.length}개를 찾았습니다. (AI 요약 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'})`;
  }
}
