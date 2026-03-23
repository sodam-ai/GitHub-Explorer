import { Star, ExternalLink, Bookmark, Activity } from 'lucide-react';
import type { Repository } from '@/types';
import { calculateHealthScore, getHealthColor } from '@/lib/health-score';

interface RepoCardProps {
  repo: Repository;
  onBookmark?: (repo: Repository) => void;
}

export function RepoCard({ repo, onBookmark }: RepoCardProps) {
  const health = calculateHealthScore(repo);

  return (
    <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {repo.owner_avatar && (
            <img
              src={repo.owner_avatar}
              alt=""
              className="w-8 h-8 rounded-full shrink-0"
            />
          )}
          <div className="min-w-0">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] font-medium hover:underline truncate block"
            >
              {repo.full_name}
            </a>
            {repo.language && (
              <span className="text-xs text-[var(--text-secondary)]">{repo.language}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* 건강도 점수 */}
          <div className="flex items-center gap-1" title={`건강도: ${health.total}/100 (${health.grade})`}>
            <Activity size={13} style={{ color: getHealthColor(health.total) }} />
            <span className="text-xs font-medium" style={{ color: getHealthColor(health.total) }}>
              {health.total}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">
              {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
            </span>
          </div>
        </div>
      </div>

      {repo.description && (
        <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
          {repo.description}
        </p>
      )}

      {repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-xs rounded-full bg-[var(--accent)]/10 text-[var(--accent)]"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => onBookmark?.(repo)}
          className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <Bookmark size={13} />
          북마크
        </button>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <ExternalLink size={13} />
          GitHub
        </a>
      </div>
    </div>
  );
}
