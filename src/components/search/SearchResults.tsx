import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, GitBranch, Code, MessageCircle, Scale } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { RepoCard } from './RepoCard';
import { CodeViewer } from './CodeViewer';
import { RepoCompare } from './RepoCompare';
import { RepoPreview } from './RepoPreview';
import { SearchFilters, type SearchFilterValues } from './SearchFilters';
import { CodeQAPanel } from '@/components/chat/CodeQAPanel';
import type { SearchTab, Repository } from '@/types';

const TABS: { key: SearchTab; label: string; icon: React.ReactNode }[] = [
  { key: 'repositories', label: '저장소', icon: <GitBranch size={14} /> },
  { key: 'code', label: '코드', icon: <Code size={14} /> },
  { key: 'issues', label: '이슈', icon: <MessageCircle size={14} /> },
];

interface SearchResultsProps {
  onReSearch?: () => void;
}

export function SearchResults({ onReSearch }: SearchResultsProps = {}) {
  const { searchResult, activeTab, setActiveTab, searchFilters, setSearchFilters } = useAppStore();
  const filters = searchFilters;
  const setFilters = (f: SearchFilterValues) => {
    setSearchFilters(f);
    // 필터 변경 시 재검색
    setTimeout(() => onReSearch?.(), 100);
  };
  const [compareRepos, setCompareRepos] = useState<Repository[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [qaRepo, setQaRepo] = useState<Repository | null>(null);
  const [previewRepo, setPreviewRepo] = useState<Repository | null>(null);
  const [activeRepoIndex, setActiveRepoIndex] = useState(-1);

  const filteredRepos = useMemo(() => {
    if (!searchResult) return [];
    let repos = [...searchResult.repositories];

    // 클라이언트 사이드 필터링 (API 필터 보완)
    if (filters.language) {
      repos = repos.filter((r) => r.language?.toLowerCase() === filters.language.toLowerCase());
    }
    if (filters.minStars > 0) {
      repos = repos.filter((r) => r.stars >= filters.minStars);
    }
    if (filters.owner) {
      const ownerLower = filters.owner.toLowerCase();
      repos = repos.filter((r) => r.full_name.toLowerCase().includes(ownerLower));
    }
    if (filters.excludeArchived) {
      // archived 정보가 없으면 통과
    }

    // 정렬
    if (filters.sortBy === 'stars') repos.sort((a, b) => b.stars - a.stars);
    else if (filters.sortBy === 'updated') repos.sort((a, b) => new Date(b.last_synced).getTime() - new Date(a.last_synced).getTime());

    return repos;
  }, [searchResult, filters]);

  // 키보드 탐색 (입력 중일 때는 무시)
  const handleKeyNav = useCallback(
    (e: KeyboardEvent) => {
      // input, textarea, select 등에 포커스 중이면 키보드 탐색 비활성화
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (activeTab !== 'repositories' || !filteredRepos.length) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setActiveRepoIndex((i) => Math.min(i + 1, filteredRepos.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setActiveRepoIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter' && activeRepoIndex >= 0) {
        e.preventDefault();
        setPreviewRepo(filteredRepos[activeRepoIndex]);
      } else if (e.key === 'Escape') {
        setActiveRepoIndex(-1);
      }
    },
    [activeTab, filteredRepos, activeRepoIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [handleKeyNav]);

  useEffect(() => {
    setActiveRepoIndex(-1);
  }, [searchResult]);

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
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-3.5 rounded-[var(--radius)] bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 w-5 h-5 rounded-md bg-[var(--accent-muted)] flex items-center justify-center shrink-0">
              <Sparkles size={11} className="text-[var(--accent)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-[var(--text-tertiary)] mb-1">AI 분석</p>
              <p className="text-[13px] leading-[1.6] text-[var(--text-secondary)]">{searchResult.ai_summary}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 탭 + 필터 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5 bg-[var(--bg-secondary)] rounded-lg p-0.5">
          {TABS.map((tab) => {
            const count =
              tab.key === 'repositories'
                ? filteredRepos.length
                : tab.key === 'code'
                  ? searchResult.code_results.length
                  : searchResult.issue_results.length;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  isActive
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-[var(--bg-card)] rounded-md shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab.icon}
                  {tab.label}
                  <span className={`px-1.5 py-px text-[10px] rounded-full ${
                    isActive ? 'bg-[var(--accent-muted)] text-[var(--accent)]' : 'bg-[var(--bg-primary)] text-[var(--text-tertiary)]'
                  }`}>
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'repositories' && compareRepos.length >= 2 && (
            <button
              onClick={() => setShowCompare(true)}
              className="btn btn-primary text-[11px] py-1"
            >
              <Scale size={11} />
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
          filteredRepos.map((repo, i) => (
            <div key={repo.id} className="relative">
              <RepoCard
                repo={repo}
                onCodeQA={(r) => setQaRepo(r)}
                onPreview={(r) => setPreviewRepo(r)}
                index={i}
                isActive={i === activeRepoIndex}
              />
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

      {/* 미리보기 */}
      <AnimatePresence>
        {previewRepo && (
          <RepoPreview repo={previewRepo} onClose={() => setPreviewRepo(null)} />
        )}
      </AnimatePresence>

      {/* 코드 Q&A */}
      {qaRepo && (
        <CodeQAPanel repo={qaRepo} onClose={() => setQaRepo(null)} />
      )}
    </div>
  );
}
