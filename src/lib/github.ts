import type { Repository, CodeResult, IssueResult } from '@/types';

const GITHUB_API = 'https://api.github.com';

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function searchRepositories(
  query: string,
  token?: string,
  page = 1,
  perPage = 10
): Promise<{ items: Repository[]; total_count: number }> {
  const res = await fetch(
    `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&page=${page}&per_page=${perPage}`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  return {
    total_count: data.total_count,
    items: data.items.map(
      (item: Record<string, unknown>): Repository => ({
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
      })
    ),
  };
}

export async function searchCode(
  query: string,
  token?: string,
  page = 1,
  perPage = 10
): Promise<{ items: CodeResult[]; total_count: number }> {
  const res = await fetch(
    `${GITHUB_API}/search/code?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
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
  const res = await fetch(
    `${GITHUB_API}/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&page=${page}&per_page=${perPage}`,
    { headers: getHeaders(token) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
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
