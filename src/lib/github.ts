import type { Repository, CodeResult, IssueResult } from '@/types';

const GITHUB_API = 'https://api.github.com';

// GitHub REST API 한도(비인증 60회/시간, 인증 5,000회/시간) 보호용 최소 요청 간격
let lastRequestAt = 0;
const MIN_REQUEST_INTERVAL_MS = 120;

export function throttledFetch(input: string, init?: RequestInit): Promise<Response> {
  const now = Date.now();
  const nextSlot = Math.max(now, lastRequestAt + MIN_REQUEST_INTERVAL_MS);
  const wait = nextSlot - now;
  lastRequestAt = nextSlot;
  return wait > 0
    ? new Promise((resolve) => setTimeout(resolve, wait)).then(() => fetch(input, init))
    : fetch(input, init);
}

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export interface SearchOptions {
  owner?: string;
  language?: string;
  license?: string;
  minStars?: number;
  minForks?: number;
  updatedAfter?: string;
  excludeArchived?: boolean;
  sortBy?: string;
}

function buildQuery(query: string, opts?: SearchOptions): string {
  // 빈 쿼리일 때 필터로만 검색하려면 최소 조건 필요
  let q = query || 'stars:>0';
  // owner: user OR org 는 API에서 OR 지원 안 하므로 user만 사용
  if (opts?.owner) q += ` user:${opts.owner}`;
  if (opts?.language) q += ` language:${opts.language}`;
  if (opts?.license) q += ` license:${opts.license}`;
  if (opts?.minStars && opts.minStars > 0) q += ` stars:>=${opts.minStars}`;
  if (opts?.minForks && opts.minForks > 0) q += ` forks:>=${opts.minForks}`;
  if (opts?.updatedAfter) {
    const days = parseInt(opts.updatedAfter);
    if (days > 0) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      q += ` pushed:>${date.toISOString().split('T')[0]}`;
    }
  }
  if (opts?.excludeArchived) q += ` archived:false`;
  return q;
}

function getSortParam(sortBy?: string): string {
  if (sortBy === 'stars') return 'stars';
  if (sortBy === 'updated') return 'updated';
  if (sortBy === 'forks') return 'forks';
  return 'stars';
}

// 단일 단어이고 특수문자 없으면 사용자명일 가능성 높음
function looksLikeUsername(query: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(query.trim()) && !query.includes(' ');
}

// 사용자의 인기 저장소 가져오기
async function getUserRepos(username: string, token?: string): Promise<Repository[]> {
  try {
    const res = await throttledFetch(
      `${GITHUB_API}/users/${username}/repos?sort=stars&direction=desc&per_page=10`,
      { headers: getHeaders(token) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data as Array<Record<string, unknown>>).map((item) => ({
      id: String(item.id),
      full_name: item.full_name as string,
      description: item.description as string | null,
      stars: item.stargazers_count as number,
      language: item.language as string | null,
      topics: (item.topics as string[]) || [],
      url: item.html_url as string,
      readme_snippet: null,
      owner_avatar: (item.owner as Record<string, string>)?.avatar_url || null,
      last_synced: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }));
  } catch (e) {
    // 3단계 병렬 검색 중 보조 전략(사용자 저장소 조회)만 실패한 것 — 메인/user: 검색은 별도로
    // 계속 진행되므로 사용자에게 토스트로 알리지 않고 개발자 확인용으로만 남긴다
    console.warn(`사용자 저장소 보조 검색 실패(무시하고 계속 진행): ${username}`, e);
    return [];
  }
}

export async function searchRepositories(
  query: string,
  token?: string,
  page = 1,
  perPage = 20,
  opts?: SearchOptions
): Promise<{ items: Repository[]; total_count: number }> {
  const trimmed = query.trim();

  // 전략 1: 일반 검색
  const q = buildQuery(trimmed, opts);
  const sort = getSortParam(opts?.sortBy);
  const searchPromise = throttledFetch(
    `${GITHUB_API}/search/repositories?q=${encodeURIComponent(q)}&sort=${sort}&order=desc&page=${page}&per_page=${perPage}`,
    { headers: getHeaders(token) }
  ).then(async (res) => {
    if (!res.ok) return { items: [] as Repository[], total_count: 0 };
    const data = await res.json();
    return {
      total_count: data.total_count as number,
      items: (data.items as Array<Record<string, unknown>>).map(mapRepo),
    };
  });

  // 전략 2: 사용자명처럼 보이면 해당 유저의 저장소도 검색
  let userReposPromise: Promise<Repository[]> = Promise.resolve([]);
  if (looksLikeUsername(trimmed) && page === 1) {
    userReposPromise = getUserRepos(trimmed, token);
  }

  // 전략 3: user: 쿼리로도 검색 (공백 포함 검색어도 커버)
  let userSearchPromise: Promise<Repository[]> = Promise.resolve([]);
  if (page === 1 && !opts?.owner) {
    const userQ = buildQuery(`user:${trimmed.split(' ')[0]}`, opts);
    userSearchPromise = throttledFetch(
      `${GITHUB_API}/search/repositories?q=${encodeURIComponent(userQ)}&sort=stars&order=desc&per_page=5`,
      { headers: getHeaders(token) }
    ).then(async (res) => {
      if (!res.ok) return [];
      const data = await res.json();
      return (data.items as Array<Record<string, unknown>>).map(mapRepo);
    }).catch((e) => {
      // 보조 전략(user: 검색)만 실패 — 메인 검색 결과는 그대로 유지되므로 토스트 없이 로그만
      console.warn('user: 검색 보조 전략 실패(무시하고 계속 진행)', e);
      return [];
    });
  }

  const [searchResult, userRepos, userSearchRepos] = await Promise.all([
    searchPromise,
    userReposPromise,
    userSearchPromise,
  ]);

  // 결과 병합 (중복 제거, 유저 저장소 우선)
  const seen = new Set<string>();
  const merged: Repository[] = [];

  // 유저 직접 저장소가 있으면 먼저
  for (const repo of userRepos) {
    if (!seen.has(repo.full_name)) {
      seen.add(repo.full_name);
      merged.push(repo);
    }
  }
  // user: 검색 결과
  for (const repo of userSearchRepos) {
    if (!seen.has(repo.full_name)) {
      seen.add(repo.full_name);
      merged.push(repo);
    }
  }
  // 일반 검색 결과
  for (const repo of searchResult.items) {
    if (!seen.has(repo.full_name)) {
      seen.add(repo.full_name);
      merged.push(repo);
    }
  }

  return {
    total_count: Math.max(searchResult.total_count, merged.length),
    items: merged,
  };
}

function mapRepo(item: Record<string, unknown>): Repository {
  return {
    id: String(item.id),
    full_name: item.full_name as string,
    description: item.description as string | null,
    stars: item.stargazers_count as number,
    language: item.language as string | null,
    topics: (item.topics as string[]) || [],
    url: item.html_url as string,
    readme_snippet: null,
    owner_avatar: (item.owner as Record<string, string>)?.avatar_url || null,
    last_synced: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
}

export async function searchCode(
  query: string,
  token?: string,
  page = 1,
  perPage = 10
): Promise<{ items: CodeResult[]; total_count: number }> {
  const res = await throttledFetch(
    `${GITHUB_API}/search/code?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) return { items: [], total_count: 0 };
  const data = await res.json();
  return {
    total_count: data.total_count,
    items: data.items.map(
      (item: Record<string, unknown>): CodeResult => ({
        repository: (item.repository as Record<string, string>)?.full_name || '',
        path: item.path as string,
        content: (item.text_matches as Array<Record<string, string>>)?.[0]?.fragment || '',
        url: item.html_url as string,
        score: item.score as number,
      })
    ),
  };
}

export async function searchIssues(
  query: string,
  token?: string,
  page = 1,
  perPage = 10
): Promise<{ items: IssueResult[]; total_count: number }> {
  const res = await throttledFetch(
    `${GITHUB_API}/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&page=${page}&per_page=${perPage}`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) return { items: [], total_count: 0 };
  const data = await res.json();
  return {
    total_count: data.total_count,
    items: data.items.map(
      (item: Record<string, unknown>): IssueResult => ({
        repository: (item.repository_url as string)?.replace('https://api.github.com/repos/', '') || '',
        title: item.title as string,
        body: ((item.body as string) || '').slice(0, 200),
        state: item.state as 'open' | 'closed',
        url: item.html_url as string,
        created_at: item.created_at as string,
        comments: item.comments as number,
      })
    ),
  };
}
