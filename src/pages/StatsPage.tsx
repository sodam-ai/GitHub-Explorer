import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, BarChart3, Clock, Globe, Star } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export function StatsPage() {
  const { setCurrentPage, searchHistory } = useAppStore();

  const stats = useMemo(() => {
    const totalSearches = searchHistory.length;
    const totalResults = searchHistory.reduce((sum, h) => sum + h.result_count, 0);

    // 가장 많이 검색한 키워드
    const queryCount: Record<string, number> = {};
    searchHistory.forEach((h) => {
      const words = h.query.toLowerCase().split(/\s+/);
      words.forEach((w) => {
        if (w.length > 2) queryCount[w] = (queryCount[w] || 0) + 1;
      });
    });
    const topKeywords = Object.entries(queryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // 시간대별 검색
    const hourCount: Record<number, number> = {};
    searchHistory.forEach((h) => {
      const hour = new Date(h.searched_at).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });
    const peakHour = Object.entries(hourCount)
      .sort((a, b) => b[1] - a[1])[0];

    // 일별 검색
    const dayCount: Record<string, number> = {};
    searchHistory.forEach((h) => {
      const day = new Date(h.searched_at).toLocaleDateString('ko');
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const recentDays = Object.entries(dayCount).slice(0, 7).reverse();

    return { totalSearches, totalResults, topKeywords, peakHour, recentDays };
  }, [searchHistory]);

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

        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={16} className="text-[var(--accent)]" />
          <h1 className="text-[18px] font-bold tracking-tight">사용 통계</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
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
              className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg-card)]"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <card.icon size={12} style={{ color: card.color }} />
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{card.label}</span>
              </div>
              <p className="text-[22px] font-bold tabular-nums">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Activity chart */}
        {stats.recentDays.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[12px] font-medium text-[var(--text-tertiary)] mb-3 flex items-center gap-1.5">
              <Globe size={12} />
              최근 활동
            </h2>
            <div className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg-card)]">
              <div className="flex items-end gap-2 h-24">
                {stats.recentDays.map(([day, count], i) => {
                  const maxCount = Math.max(...stats.recentDays.map(([, c]) => c));
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <motion.div
                      key={day}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="flex-1 flex flex-col items-center justify-end"
                    >
                      <div
                        className="w-full rounded-t-md bg-[var(--accent)] min-h-[4px]"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[9px] text-[var(--text-tertiary)] mt-1.5 truncate w-full text-center">
                        {day.split('. ').slice(1).join('.')}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Top keywords */}
        {stats.topKeywords.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[12px] font-medium text-[var(--text-tertiary)] mb-3 flex items-center gap-1.5">
              <Search size={12} />
              자주 검색한 키워드
            </h2>
            <div className="flex flex-wrap gap-2">
              {stats.topKeywords.map(([word, count], i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="badge bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[11px] px-2.5 py-1"
                >
                  {word}
                  <span className="ml-1.5 text-[var(--text-tertiary)]">{count}</span>
                </motion.span>
              ))}
            </div>
          </section>
        )}

        {stats.totalSearches === 0 && (
          <div className="text-center py-16">
            <BarChart3 size={40} className="mx-auto text-[var(--text-tertiary)] opacity-20 mb-3" />
            <p className="text-[13px] text-[var(--text-tertiary)]">검색 기록이 없습니다</p>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-1">검색을 시작하면 통계가 표시됩니다</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
