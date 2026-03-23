import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, ArrowLeft, Flame, ExternalLink } from 'lucide-react';
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
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 700, padding: '32px 32px 60px' }}>

        <button
          onClick={() => setCurrentPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 }}
        >
          <ArrowLeft size={15} />
          뒤로
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={22} style={{ color: 'var(--accent)' }} />
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>트렌딩</h1>
          </div>

          <div style={{
            display: 'flex', gap: 4, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 12, padding: 4,
          }}>
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  position: 'relative', padding: '8px 18px', borderRadius: 8,
                  fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: period === p.key ? 'var(--bg-card)' : 'transparent',
                  color: period === p.key ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: period === p.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                height: 72, borderRadius: 14, background: 'var(--bg-elevated)',
                border: '1px solid var(--border)', animation: 'pulse 1.5s infinite',
              }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {repos.map((repo, i) => (
              <motion.a
                key={repo.full_name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 20px', borderRadius: 14,
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
                }}
                className="card-hover"
              >
                <span style={{
                  fontSize: 16, fontWeight: 700, color: 'var(--text-tertiary)',
                  width: 28, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums',
                }}>
                  {i + 1}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{repo.full_name.split('/')[0]}/</span>
                    <span style={{ color: 'var(--text-primary)' }}>{repo.full_name.split('/')[1]}</span>
                  </div>
                  <p style={{
                    fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {repo.description || '설명 없음'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                    {repo.language && (
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{repo.language}</span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-tertiary)' }}>
                      <Star size={10} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                      {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Flame size={14} style={{ color: '#f97316' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f97316', fontVariantNumeric: 'tabular-nums' }}>
                    +{repo.stars_today}
                  </span>
                </div>

                <ExternalLink size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0, opacity: 0.4 }} />
              </motion.a>
            ))}

            {repos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)', fontSize: 14 }}>
                트렌딩 데이터를 불러올 수 없습니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
