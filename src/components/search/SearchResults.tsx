import { Sparkles, GitBranch, Code, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { RepoCard } from './RepoCard';
import type { SearchTab } from '@/types';

const TABS: { key: SearchTab; label: string; icon: React.ReactNode }[] = [
  { key: 'repositories', label: '저장소', icon: <GitBranch size={14} /> },
  { key: 'code', label: '코드', icon: <Code size={14} /> },
  { key: 'issues', label: '이슈', icon: <MessageCircle size={14} /> },
];

export function SearchResults() {
  const { searchResult, activeTab, setActiveTab } = useAppStore();

  if (!searchResult) return null;

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

      {/* 탭 */}
      <div className="flex items-center gap-1 border-b border-[var(--border)]">
        {TABS.map((tab) => {
          const count =
            tab.key === 'repositories'
              ? searchResult.repositories.length
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

      {/* 결과 목록 */}
      <div className="flex flex-col gap-3">
        {activeTab === 'repositories' &&
          searchResult.repositories.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}

        {activeTab === 'code' &&
          searchResult.code_results.map((code, i) => (
            <div key={i} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-card)]">
              <a
                href={code.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                {code.repository}/{code.path}
              </a>
              {code.content && (
                <pre className="mt-2 p-3 text-xs bg-[var(--bg-secondary)] rounded-lg overflow-x-auto">
                  <code>{code.content}</code>
                </pre>
              )}
            </div>
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
        {activeTab === 'repositories' && searchResult.repositories.length === 0 && (
          <p className="py-8 text-center text-[var(--text-secondary)]">저장소 결과가 없습니다.</p>
        )}
        {activeTab === 'code' && searchResult.code_results.length === 0 && (
          <p className="py-8 text-center text-[var(--text-secondary)]">코드 결과가 없습니다.</p>
        )}
        {activeTab === 'issues' && searchResult.issue_results.length === 0 && (
          <p className="py-8 text-center text-[var(--text-secondary)]">이슈 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
