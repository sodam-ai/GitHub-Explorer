import { invoke } from '@tauri-apps/api/core';
import { isTauri } from './tauri-bridge';

export interface TrendingRepo {
  full_name: string;
  description: string;
  language: string;
  stars: number;
  // 과거 방문 시 저장해둔 자체 스냅샷과 비교한 실제 증가량. 비교할 과거 스냅샷이
  // 아직 없으면(첫 사용 등) null — "집계 중"으로 표시하고 숫자를 지어내지 않는다.
  stars_today: number | null;
  url: string;
}

export async function fetchTrending(language = '', since = 'daily'): Promise<TrendingRepo[]> {
  // GitHub 공식 API에 트렌딩 엔드포인트가 없으므로
  // search API로 최근 생성된 인기 저장소를 검색하여 대체
  const dateFilter = getDateFilter(since);
  const langFilter = language ? `+language:${encodeURIComponent(language)}` : '';
  const query = `stars:>10+created:>${dateFilter}${langFilter}`;

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=20`
    );
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();

    const current: TrendingRepo[] = (data.items || []).map((item: Record<string, unknown>): TrendingRepo => ({
      full_name: item.full_name as string,
      description: (item.description as string) || '',
      language: (item.language as string) || '',
      stars: item.stargazers_count as number,
      stars_today: null,
      url: item.html_url as string,
    }));

    return applySnapshotDeltas(current, since, language);
  } catch (error) {
    console.error('Trending fetch error:', error);
    return [];
  }
}

// 자체 스냅샷 히스토리와 비교해 진짜 증가량을 계산하고, 오늘자 스냅샷을 저장한다.
// category를 "기간::언어"로 분리해 서로 다른 필터 조합의 데이터가 섞이지 않게 한다.
async function applySnapshotDeltas(
  current: TrendingRepo[],
  since: string,
  language: string
): Promise<TrendingRepo[]> {
  if (!isTauri()) return current;

  const category = `${since}::${language || 'all'}`;
  const today = new Date().toISOString().split('T')[0];

  try {
    const priorJson = await invoke<string | null>('get_latest_trending_snapshot', {
      category,
      beforeDate: today,
    });

    let withDeltas = current;
    if (priorJson) {
      const priorStarsByRepo: Record<string, number> = {};
      for (const r of JSON.parse(priorJson) as TrendingRepo[]) {
        priorStarsByRepo[r.full_name] = r.stars;
      }
      withDeltas = current.map((repo) => {
        const priorStars = priorStarsByRepo[repo.full_name];
        return {
          ...repo,
          stars_today: priorStars !== undefined ? Math.max(0, repo.stars - priorStars) : null,
        };
      });
    }

    // 실패해도 화면 표시 자체는 막지 않음 — 다음 방문 시 다시 시도됨
    invoke('save_trending_snapshot', {
      entry: { category, date: today, repositories: JSON.stringify(current) },
    }).catch((e) => console.warn('트렌딩 스냅샷 저장 실패:', e));

    return withDeltas;
  } catch (e) {
    console.warn('트렌딩 스냅샷 비교 실패, 증감치 없이 표시:', e);
    return current;
  }
}

function getDateFilter(since: string): string {
  const now = new Date();
  switch (since) {
    case 'daily':
      now.setDate(now.getDate() - 7);
      break;
    case 'weekly':
      now.setDate(now.getDate() - 30);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() - 3);
      break;
    default:
      now.setDate(now.getDate() - 7);
  }
  return now.toISOString().split('T')[0];
}
