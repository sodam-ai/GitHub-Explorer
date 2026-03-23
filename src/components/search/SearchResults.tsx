import { useState, useMemo } from 'react';
import { Sparkles, GitBranch, Code, MessageCircle, Scale } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { RepoCard } from './RepoCard';
import { CodeViewer } from './CodeViewer';
import { RepoCompare } from './RepoCompare';
import { SearchFilters, type SearchFilterValues } from './SearchFilters';
import type { SearchTab, Repository } from '@/types';

const TABS: { key: SearchTab; label: string; icon: React.ReactNode }[] = [
  { key: 'repositories', label: '저장소', icon: <GitBranch size={14} /> },
  { key: 'code', label: '코드', icon: <Code size={14} /> },
  { key: 'issues', label: '이슈', icon: <MessageCircle size={14} /> },
];

export function SearchResults() {
  const { searchResult, activeTab, setActiveTab } = useAppStore();
  const [filters, setFilters] = useState<SearchFilterValues>({ language: '', minStars: 0, sortBy: 'relevance' });
  const [compareRepos, setCompareRepos] = useState<Repository[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const filteredRepos = useMemo(() => {
    if (!searchResult) return [];
    let repos = [...searchResult.repositories];

    if (filters.language) {
      repos = repos.filter((r) => r.language?.toLowerCase() === filters.language.toLowerCase());
    }
    if (filters.minStars > 0) {
      repos = repos.filter((r) => r.stars >= filters.minStars);
    }
    if (filters.sortBy === 'stars') {
      repos.sort((a, b) => b.stars - a.stars);
    }

    return repos;
  }, [searchResult, filters]);

  if (!searchResult) return null;

  function toggleCompare(repo: Repository) {
    setCompareRepos((prev) => {
      const exists = prev.find((r) => r.id === repo.id);
      if (exists) return prev.filter((r) => r.id !== repo.id);
      if (prev.length >= 3) return prev;
      return [...prev, repo];
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* AI 요약 */}
      {searchResult.ai_summary && (
        <div className="p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20">
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed">{searchResult.ai_summary}</p>
          </div>
        </div>
      )}

      {/* 탭 + 필터 */}
      <div className="flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const count =
              tab.key === 'repositories'
                ? filteredRepos.length
                : tab.key === 'code'
                  ? searchResult.code_results.length
                  : searchResult.issue_results.length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-[var(--bg-secondary)]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pb-2">
          {activeTab === 'repositories' && compareRepos.length >= 2 && (
            <button
              onClick={() => setShowCompare(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Scale size={12} />
              비교 ({compareRepos.length})
            </button>
          )}
          {activeTab === 'repositories' && (
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          )}
        </div>
      </div>

      {/* 결과 목록 */}
      <div className="flex flex-col gap-3">
        {activeTab === 'repositories' &&
          filteredRepos.map((repo) => (
            <div key={repo.id} className="relative">
              <RepoCard repo={repo} />
              <button
                onClick={() => toggleCompare(repo)}
                className={`absolute top-4 right-4 px-2 py-1 text-xs rounded-lg border transition-colors ${
                  compareRepos.find((r) => r.id === repo.id)
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
                }`}
              >
                <Scale size={11} />
              </button>
            </div>
          ))}

        {activeTab === 'code' &&
          searchResult.code_results.map((code, i) => (
            <CodeViewer key={i} code={code} />
          ))}

        {activeTab === 'issues' &&
          searchResult.issue_results.map((issue, i) => (
            <div key={i} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-card)]">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    issue.state === 'open'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-purple-500/10 text-purple-500'
                  }`}
                >
                  {issue.state}
                </span>
                <a
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-[var(--accent)] transition-colors"
                >
                  {issue.title}
                </a>
              </div>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {issue.repository} · {issue.comments}개 댓글
              </p>
            </div>
          ))}

        {/* 빈 결과 */}
        {activeTab === 'repositories' && filteredRepos.length === 0 && (
          <p className="py-8 text-center text-[var(--text-secondary)]">
            {searchResult.repositories.length > 0 ? '필터 조건에 맞는 저장소가 없습니다.' : '저장소 결과가 없습니다.'}
          </p>
        )}
        {activeTab === 'code' && searchResult.code_results.length === 0 && (
          <p className="py-8 text-center text-[var(--text-secondary)]">코드 결과가 없습니다.</p>
        )}
        {activeTab === 'issues' && searchResult.issue_results.length === 0 && (
          <p className="py-8 text-center text-[var(--text-secondary)]">이슈 결과가 없습니다.</p>
        )}
      </div>

      {/* 비교 모달 */}
      {showCompare && (
        <RepoCompare repos={compareRepos} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
}
