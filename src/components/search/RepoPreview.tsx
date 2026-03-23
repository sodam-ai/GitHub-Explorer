import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Eye, Calendar, FileText, X } from 'lucide-react';
import type { Repository } from '@/types';

interface RepoPreviewProps {
  repo: Repository;
  onClose: () => void;
}

interface RepoDetail {
  readme: string;
  forks: number;
  watchers: number;
  open_issues: number;
  updated_at: string;
  license: string | null;
}

export function RepoPreview({ repo, onClose }: RepoPreviewProps) {
  const [detail, setDetail] = useState<RepoDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [repoRes, readmeRes] = await Promise.allSettled([
          fetch(`https://api.github.com/repos/${repo.full_name}`).then((r) => r.json()),
          fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
            headers: { Accept: 'application/vnd.github.raw+json' },
          }).then((r) => (r.ok ? r.text() : '')),
        ]);

        const repoData = repoRes.status === 'fulfilled' ? repoRes.value : {};
        const readme = readmeRes.status === 'fulfilled' ? readmeRes.value : '';

        setDetail({
          readme: (readme as string).slice(0, 800),
          forks: repoData.forks_count || 0,
          watchers: repoData.watchers_count || 0,
          open_issues: repoData.open_issues_count || 0,
          updated_at: repoData.updated_at || '',
          license: repoData.license?.spdx_id || null,
        });
      } catch {
        setDetail(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [repo.full_name]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg mx-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5 min-w-0">
            {repo.owner_avatar && (
              <img src={repo.owner_avatar} alt="" className="w-7 h-7 rounded-lg" />
            )}
            <div className="min-w-0">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium hover:text-[var(--accent)] transition-colors truncate block"
              >
                {repo.full_name}
              </a>
              {repo.language && (
                <span className="text-[10px] text-[var(--text-tertiary)]">{repo.language}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost p-1">
            <X size={15} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
            <Star size={11} className="text-amber-500 fill-amber-500" />
            {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
          </span>
          {detail && (
            <>
              <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                <GitFork size={11} />
                {detail.forks >= 1000 ? `${(detail.forks / 1000).toFixed(1)}k` : detail.forks}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                <Eye size={11} />
                {detail.watchers >= 1000 ? `${(detail.watchers / 1000).toFixed(1)}k` : detail.watchers}
              </span>
              {detail.license && (
                <span className="badge bg-[var(--bg-card)] text-[var(--text-tertiary)] text-[10px]">
                  {detail.license}
                </span>
              )}
              {detail.updated_at && (
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] ml-auto">
                  <Calendar size={9} />
                  {new Date(detail.updated_at).toLocaleDateString('ko')}
                </span>
              )}
            </>
          )}
        </div>

        {/* Description */}
        {repo.description && (
          <div className="px-4 py-2.5 border-b border-[var(--border-subtle)]">
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{repo.description}</p>
          </div>
        )}

        {/* README */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-3/4 bg-[var(--border)] rounded" />
              <div className="h-3 w-full bg-[var(--border)] rounded" />
              <div className="h-3 w-5/6 bg-[var(--border)] rounded" />
              <div className="h-3 w-2/3 bg-[var(--border)] rounded" />
            </div>
          ) : detail?.readme ? (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileText size={11} className="text-[var(--text-tertiary)]" />
                <span className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">README</span>
              </div>
              <pre className="text-[11px] text-[var(--text-secondary)] leading-[1.7] whitespace-pre-wrap font-sans">
                {detail.readme}
                {detail.readme.length >= 800 && '...'}
              </pre>
            </div>
          ) : (
            <p className="text-[12px] text-[var(--text-tertiary)] text-center py-4">README를 불러올 수 없습니다</p>
          )}
        </div>

        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 8).map((t) => (
              <span key={t} className="badge bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">
                {t}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
