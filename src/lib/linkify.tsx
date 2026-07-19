import type { ReactNode } from 'react';

// AI 답변·메모 등 자유 텍스트 안의 URL을 클릭 가능한 링크로 바꾼다.
// 저장소 URL·홈페이지 필드는 이미 각 컴포넌트에서 <a>로 렌더링되고 있어 대상이 아님.
const URL_REGEX = /(https?:\/\/[^\s<>"')\]]+)/g;

export function linkifyText(text: string): ReactNode[] {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--accent)', textDecoration: 'underline', wordBreak: 'break-all' }}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}
