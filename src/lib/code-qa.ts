import type { Repository } from '@/types';
import { chatComplete, isConfigured, type LLMConfig } from './llm-providers';

interface QAResponse {
  answer: string;
  codeRefs: string[];
}

export async function askCodeQuestion(
  question: string,
  repo: Repository,
  config: LLMConfig,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<QAResponse> {
  if (!isConfigured(config)) {
    return {
      answer: 'AI가 설정되지 않았습니다. 설정에서 API 키를 입력하거나 로컬 AI(Ollama/LM Studio)를 연결하세요.',
      codeRefs: [],
    };
  }

  // GitHub에서 README 가져오기
  let readmeContent = '';
  try {
    const res = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
      headers: { Accept: 'application/vnd.github.raw+json' },
    });
    if (res.ok) {
      readmeContent = (await res.text()).slice(0, 3000);
    }
  } catch {
    // README 없을 수 있음
  }

  // GitHub에서 파일 트리 가져오기
  let fileTree = '';
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo.full_name}/git/trees/HEAD?recursive=1`
    );
    if (res.ok) {
      const data = await res.json();
      const files = (data.tree as Array<{ path: string; type: string }>)
        .filter((f) => f.type === 'blob')
        .map((f) => f.path)
        .slice(0, 50);
      fileTree = files.join('\n');
    }
  } catch {
    // 트리 없을 수 있음
  }

  const systemPrompt = `당신은 GitHub 저장소 "${repo.full_name}"의 코드를 분석하는 AI입니다.
한국어로 답변하세요. 코드를 인용할 때는 파일 경로를 포함하세요.

저장소 정보:
- 이름: ${repo.full_name}
- 설명: ${repo.description || '없음'}
- 언어: ${repo.language || '알 수 없음'}
- 스타: ${repo.stars}
- 토픽: ${repo.topics.join(', ') || '없음'}

${readmeContent ? `README (앞부분):\n${readmeContent}\n` : ''}
${fileTree ? `파일 구조:\n${fileTree}\n` : ''}

답변 규칙:
1. 코드 예시를 포함하세요
2. 파일 경로를 언급하세요 (예: src/hooks/useSortable.ts)
3. 2~3문단으로 간결하게 답변하세요
4. 확실하지 않은 내용은 추측이라고 명시하세요`;

  try {
    const answer = await chatComplete(
      config,
      systemPrompt,
      question,
      conversationHistory.slice(-6),
      800
    );

    // 코드 참조 추출 (파일 경로 패턴)
    const codeRefPattern = /(?:src|lib|pkg|packages?|app|components?)\/[\w\-./]+\.\w+/g;
    const codeRefs = [...new Set(answer.match(codeRefPattern) || [])] as string[];

    return { answer: answer || '답변을 생성할 수 없습니다.', codeRefs };
  } catch (error) {
    return {
      answer: `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      codeRefs: [],
    };
  }
}
