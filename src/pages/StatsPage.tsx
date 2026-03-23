import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, BarChart3, Clock, Star } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export function StatsPage() {
  const { setCurrentPage, searchHistory } = useAppStore();

  const stats = useMemo(() => {
    const totalSearches = searchHistory.length;
    const totalResults = searchHistory.reduce((sum, h) => sum + h.result_count, 0);

    const queryCount: Record<string, number> = {};
    searchHistory.forEach((h) => {
      h.query.toLowerCase().split(/\s+/).forEach((w) => {
        if (w.length > 2) queryCount[w] = (queryCount[w] || 0) + 1;
      });
    });
    const topKeywords = Object.entries(queryCount).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const hourCount: Record<number, number> = {};
    searchHistory.forEach((h) => {
      const hour = new Date(h.searched_at).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });
    const peakHour = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0];

    const dayCount: Record<string, number> = {};
    searchHistory.forEach((h) => {
      const day = new Date(h.searched_at).toLocaleDateString('ko');
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const recentDays = Object.entries(dayCount).slice(0, 7).reverse();

    return { totalSearches, totalResults, topKeywords, peakHour, recentDays };
  }, [searchHistory]);

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <BarChart3 size={22} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>사용 통계</h1>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: '총 검색', value: stats.totalSearches, icon: Search, color: 'var(--accent)' },
            { label: '찾은 결과', value: stats.totalResults, icon: Star, color: '#f59e0b' },
            { label: '피크 시간', value: stats.peakHour ? `${stats.peakHour[0]}시` : '-', icon: Clock, color: '#8b5cf6' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '20px 20px', borderRadius: 14,
                border: '1px solid var(--border)', background: 'var(--bg-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <card.icon size={14} style={{ color: card.color }} />
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{card.label}</span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Activity chart */}
        {stats.recentDays.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 14 }}>최근 활동</h2>
            <div style={{
              padding: 24, borderRadius: 14,
              border: '1px solid var(--border)', background: 'var(--bg-card)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
                {stats.recentDays.map(([day, count], i) => {
                  const maxCount = Math.max(...stats.recentDays.map(([, c]) => c));
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <motion.div
                      key={day}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}
                    >
                      <div style={{
                        width: '100%', borderRadius: '6px 6px 0 0',
                        background: 'var(--accent)', minHeight: 4,
                        height: `${height}%`,
                      }} />
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 8, textAlign: 'center' }}>
                        {day.split('. ').slice(1).join('.')}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Top keywords */}
        {stats.topKeywords.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 14 }}>자주 검색한 키워드</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {stats.topKeywords.map(([word, count], i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                    background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {word} <span style={{ color: 'var(--text-tertiary)', marginLeft: 4 }}>{count}</span>
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {stats.totalSearches === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <BarChart3 size={48} style={{ color: 'var(--text-tertiary)', opacity: 0.2, margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>검색 기록이 없습니다</p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>검색을 시작하면 통계가 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
