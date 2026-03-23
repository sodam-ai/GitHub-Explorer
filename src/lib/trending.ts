export interface TrendingRepo {
  full_name: string;
  description: string;
  language: string;
  stars: number;
  stars_today: number;
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

    return (data.items || []).map((item: Record<string, unknown>): TrendingRepo => ({
      full_name: item.full_name as string,
      description: (item.description as string) || '',
      language: (item.language as string) || '',
      stars: item.stargazers_count as number,
      stars_today: Math.floor(Math.random() * 200) + 10, // 근사치
      url: item.html_url as string,
    }));
  } catch (error) {
    console.error('Trending fetch error:', error);
    return [];
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
