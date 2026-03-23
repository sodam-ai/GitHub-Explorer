import { useState, useEffect } from 'react';
import { TrendingUp, Star, Loader2, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { fetchTrending, type TrendingRepo } from '@/lib/trending';

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
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <button
        onClick={() => setCurrentPage('home')}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        뒤로
      </button>

      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={24} className="text-[var(--accent)]" />
        <h1 className="text-2xl font-bold">트렌딩</h1>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${
              period === p.key
                ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                : 'border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          <p className="text-sm text-[var(--text-secondary)]">트렌딩 로드 중...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {repos.map((repo, i) => (
            <div
              key={repo.full_name}
              className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-colors"
            >
              <span className="text-lg font-bold text-[var(--text-secondary)] w-8 text-center">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] font-medium hover:underline"
                >
                  {repo.full_name}
                </a>
                <p className="text-sm text-[var(--text-secondary)] truncate mt-0.5">
                  {repo.description}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  {repo.language && (
                    <span className="text-xs text-[var(--text-secondary)]">{repo.language}</span>
                  )}
                  <span className="flex items-center gap-1 text-xs">
                    <Star size={11} className="text-yellow-500 fill-yellow-500" />
                    {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-medium text-green-500">
                  +{repo.stars_today}
                </span>
                <p className="text-xs text-[var(--text-secondary)]">today</p>
              </div>
            </div>
          ))}

          {repos.length === 0 && (
            <p className="py-8 text-center text-[var(--text-secondary)]">트렌딩 데이터를 불러올 수 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
