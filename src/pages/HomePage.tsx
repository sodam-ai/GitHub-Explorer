import { motion } from 'framer-motion';
import { Clock, ArrowRight, Search, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { SearchBar } from '@/components/search/SearchBar';

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
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
        className="text-center mb-14"
      >
        <h1 className="text-[36px] font-bold tracking-tight leading-tight">
          GitHub를 <span className="text-[var(--accent)]">자연어</span>로 검색하세요
        </h1>
        <p className="mt-4 text-[var(--text-secondary)] text-[16px]">
          저장소, 코드, 이슈를 AI가 찾아드립니다
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
        className="w-full flex justify-center"
      >
        <SearchBar onSearch={onSearch} large />
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.query}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            onClick={() => onSearch(s.query)}
            className="btn btn-outline text-[13px] gap-2 py-2 px-4"
          >
            <Sparkles size={11} className="text-[var(--accent)]" />
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
          className="mt-16 w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={13} className="text-[var(--text-tertiary)]" />
            <span className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
              최근 검색
            </span>
          </div>

          <div className="border border-[var(--border)] rounded-2xl bg-[var(--bg-card)] overflow-hidden shadow-[var(--shadow-sm)]">
            {searchHistory.slice(0, 4).map((h, i) => (
              <motion.button
                key={h.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.04 }}
                onClick={() => onSearch(h.query)}
                className={`w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-secondary)] transition-colors group text-left ${
                  i > 0 ? 'border-t border-[var(--border-subtle)]' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Search size={14} className="text-[var(--text-tertiary)] shrink-0" />
                  <span className="text-[14px] truncate">{h.query}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[12px] text-[var(--text-tertiary)]">{h.result_count}건</span>
                  <ArrowRight
                    size={12}
                    className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
