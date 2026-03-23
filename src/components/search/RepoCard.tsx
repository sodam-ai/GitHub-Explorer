import { Star, ExternalLink, Bookmark, MessageCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Repository } from '@/types';
import { calculateHealthScore, getHealthColor } from '@/lib/health-score';

interface RepoCardProps {
  repo: Repository;
  onBookmark?: (repo: Repository) => void;
  onCodeQA?: (repo: Repository) => void;
  index?: number;
}

export function RepoCard({ repo, onBookmark, onCodeQA, index = 0 }: RepoCardProps) {
  const health = calculateHealthScore(repo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="group p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg-card)] card-hover"
    >
      <div className="flex items-start gap-3">
        {repo.owner_avatar && (
          <img
            src={repo.owner_avatar}
            alt=""
            className="w-9 h-9 rounded-lg shrink-0 border border-[var(--border-subtle)]"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate"
            >
              <span className="text-[var(--text-tertiary)]">
                {repo.full_name.split('/')[0]}/
              </span>
              {repo.full_name.split('/')[1]}
            </a>
          </div>

          {repo.description && (
            <p className="mt-1 text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
              {repo.description}
            </p>
          )}

          <div className="mt-2.5 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-[12px] text-[var(--text-secondary)]">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
            </span>

            {repo.language && (
              <span className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
                <span className="w-2.5 h-2.5 rounded-full" style={{
                  background: getLanguageColor(repo.language),
                }} />
                {repo.language}
              </span>
            )}

            <span
              className="flex items-center gap-1 text-[12px] font-medium"
              style={{ color: getHealthColor(health.total) }}
              title={`건강도 ${health.total}/100 (${health.grade})`}
            >
              <Activity size={11} />
              {health.grade}
            </span>

            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="badge bg-[var(--bg-secondary)] text-[var(--text-tertiary)]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions - 호버 시 표시 */}
      <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onCodeQA?.(repo)}
          className="btn btn-ghost text-[12px]"
        >
          <MessageCircle size={12} />
          코드 질문
        </button>
        <button
          onClick={() => onBookmark?.(repo)}
          className="btn btn-ghost text-[12px]"
        >
          <Bookmark size={12} />
          저장
        </button>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-[12px] ml-auto"
        >
          <ExternalLink size={12} />
          GitHub
        </a>
      </div>
    </motion.div>
  );
}

function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
    Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
    'C#': '#178600', Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138',
    Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
  };
  return colors[lang] || '#8b8b8b';
}
