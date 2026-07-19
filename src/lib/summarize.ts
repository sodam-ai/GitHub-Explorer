// README 마크다운에서 뱃지·이미지·헤더·HTML을 걸러내고 첫 서술 문단만 추출한다.
// AI 호출 없이 항상 동작하는 저장소 요약 기본값 — 규칙 기반, 응답 지연 없음.

export function extractReadmeSummary(markdown: string, maxLength = 220): string | null {
  const lines = markdown.split('\n');
  const paragraph: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (paragraph.length > 0) break; // 첫 문단이 끝났으면 종료
      continue;
    }
    if (line.startsWith('#')) continue; // 헤더
    if (line.startsWith('<')) continue; // HTML 태그 줄 (예: <p align="center">)
    if (/^!\[[^\]]*\]\([^)]*\)$/.test(line)) continue; // 이미지만 있는 줄
    if (/^\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)$/.test(line)) continue; // 뱃지 링크
    if (/^(---+|\*\*\*+|___+)$/.test(line)) continue; // 구분선
    if (/^\|.*\|$/.test(line)) continue; // 마크다운 표 행

    const stripped = line
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/<[^>]+>/g, '')
      .trim();
    if (stripped) paragraph.push(stripped);
  }

  if (paragraph.length === 0) return null;
  const text = paragraph.join(' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export function decodeBase64Utf8(base64: string): string {
  const cleaned = base64.replace(/\n/g, '');
  const bytes = Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}
