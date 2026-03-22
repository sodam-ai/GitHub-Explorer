export interface Repository {
  id: string;
  full_name: string;
  description: string | null;
  stars: number;
  language: string | null;
  topics: string[];
  url: string;
  readme_snippet: string | null;
  owner_avatar: string | null;
  last_synced: string;
  created_at: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  result_count: number;
  filters: Record<string, string> | null;
  searched_at: string;
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'cloud' | 'local';
  model: string;
  endpoint: string;
  api_key?: string;
  is_default: boolean;
}

export interface SearchResult {
  repositories: Repository[];
  code_results: CodeResult[];
  issue_results: IssueResult[];
  ai_summary: string;
  total_count: number;
}

export interface CodeResult {
  repository: string;
  path: string;
  content: string;
  url: string;
  score: number;
}

export interface IssueResult {
  repository: string;
  title: string;
  body: string;
  state: 'open' | 'closed';
  url: string;
  created_at: string;
  comments: number;
}

export type SearchTab = 'repositories' | 'code' | 'issues';
export type Theme = 'light' | 'dark';
