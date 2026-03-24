import { motion } from 'framer-motion';
import { Clock, ArrowRight, Search, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';

interface HomePageProps {
  onSearch: (query: string) => void;
}

const SUGGESTIONS = [
  { label: 'React 드래그앤드롭', query: 'React drag and drop library' },
  { label: 'Python 웹 크롤러', query: 'Python web scraper library' },
  { label: 'TypeScript ORM', query: 'TypeScript ORM database' },
  { label: 'Rust CLI 도구', query: 'Rust command line tool' },
];

export function HomePage({ onSearch }: HomePageProps) {
  const { searchHistory } = useAppStore();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px 80px 40px', minHeight: 0, overflow: 'auto' }}>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 80 }}
      >
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          GitHub를 <span style={{ color: 'var(--accent)' }}>자연어</span>로 검색하세요
        </h1>
        <p style={{ marginTop: 20, color: 'var(--text-secondary)', fontSize: 17 }}>
          저장소, 코드, 이슈를 AI가 찾아드립니다
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 10 }}>
          <SearchBar onSearch={onSearch} large />
          <div style={{ paddingTop: 6 }}>
            <SearchFilters
              filters={useAppStore.getState().searchFilters}
              onFiltersChange={(f) => useAppStore.getState().setSearchFilters(f)}
            />
          </div>
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.query}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            onClick={() => onSearch(s.query)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', fontSize: 13, fontWeight: 500,
              borderRadius: 999, border: '2px solid var(--border)',
              color: 'var(--text-secondary)', background: 'transparent',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            className="hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)]"
          >
            <Sparkles size={12} style={{ color: 'var(--accent)' }} />
            {s.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Recent */}
      {searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 48, width: '100%', maxWidth: 480 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Clock size={12} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              최근 검색
            </span>
          </div>

          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '2px solid var(--border)',
            background: 'var(--bg-elevated)',
            boxShadow: 'var(--shadow-md)',
          }}>
            {searchHistory.slice(0, 4).map((h, i) => (
              <motion.button
                key={h.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.04 }}
                onClick={() => onSearch(h.query)}
                className="hover:bg-[var(--accent-muted)]"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 18px', textAlign: 'left', cursor: 'pointer',
                  background: 'transparent', border: 'none', color: 'inherit',
                  transition: 'all 0.15s',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.query}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11, color: 'var(--text-tertiary)',
                  }}>
                    {h.result_count}건
                  </span>
                  <ArrowRight size={14} style={{ color: 'var(--text-tertiary)', opacity: 0 }} className="group-hover:opacity-100" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
