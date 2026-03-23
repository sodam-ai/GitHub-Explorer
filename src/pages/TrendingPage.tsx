import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, ArrowLeft, Flame } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { fetchTrending, type TrendingRepo } from '@/lib/trending';
import { SkeletonCard } from '@/components/ui/Skeleton';

const PERIODS = [
  { key: 'daily', label: '오늘' },
  { key: 'weekly', label: '이번 주' },
  { key: 'monthly', label: '이번 달' },
];

export function TrendingPage() {
  const { setCurrentPage } = useAppStore();
  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily');

  useEffect(() => {
    setLoading(true);
    fetchTrending('', period).then((data) => {
      setRepos(data);
      setLoading(false);
    });
  }, [period]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto"
    >
      <div className="max-w-2xl mx-auto px-6 py-6">
        <button
          onClick={() => setCurrentPage('home')}
          className="btn btn-ghost text-[11px] -ml-2 mb-4"
        >
          <ArrowLeft size={13} />
          뒤로
        </button>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[var(--accent)]" />
            <h1 className="text-[18px] font-bold tracking-tight">트렌딩</h1>
          </div>

          <div className="flex items-center gap-0.5 bg-[var(--bg-secondary)] rounded-lg p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`relative px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                  period === p.key
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {period === p.key && (
                  <motion.div
                    layoutId="trend-tab"
                    className="absolute inset-0 bg-[var(--bg-card)] rounded-md shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {repos.map((repo, i) => (
              <motion.div
                key={repo.full_name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3.5 p-3 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg-card)] card-hover"
              >
                <span className="text-[14px] font-bold text-[var(--text-tertiary)] w-6 text-right shrink-0 tabular-nums">
                  {i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-medium hover:text-[var(--accent)] transition-colors"
                  >
                    <span className="text-[var(--text-tertiary)]">{repo.full_name.split('/')[0]}/</span>
                    {repo.full_name.split('/')[1]}
                  </a>
                  <p className="text-[11px] text-[var(--text-tertiary)] truncate mt-0.5">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    {repo.language && (
                      <span className="text-[10px] text-[var(--text-tertiary)]">{repo.language}</span>
                    )}
                    <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-tertiary)]">
                      <Star size={9} className="text-amber-500 fill-amber-500" />
                      {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Flame size={11} className="text-orange-500" />
                  <span className="text-[12px] font-semibold text-orange-500 tabular-nums">
                    +{repo.stars_today}
                  </span>
                </div>
              </motion.div>
            ))}

            {repos.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[13px] text-[var(--text-tertiary)]">트렌딩 데이터를 불러올 수 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
