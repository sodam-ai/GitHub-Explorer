import { motion } from 'framer-motion';
import { Search, Clock, ArrowUpRight, Sparkles, TrendingUp, FolderOpen, Zap } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { SearchBar } from '@/components/search/SearchBar';

interface HomePageProps {
  onSearch: (query: string) => void;
}

const SUGGESTIONS = [
  'React 드래그앤드롭 라이브러리',
  'Python FastAPI 인증 예제',
  'TypeScript 상태관리 2026',
  'Rust CLI 도구 모음',
];

export function HomePage({ onSearch }: HomePageProps) {
  const { searchHistory, setCurrentPage } = useAppStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <motion.div
          className="p-4 bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 rounded-3xl mb-4"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Search size={40} className="text-[var(--accent)]" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight">GitHub AI Explorer</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-lg">AI로 GitHub를 자연어 검색</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full flex justify-center"
      >
        <SearchBar onSearch={onSearch} large />
      </motion.div>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 flex flex-wrap justify-center gap-2"
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSearch(s)}
            className="px-3 py-1.5 text-xs rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
          >
            <Sparkles size={10} className="inline mr-1" />
            {s}
          </button>
        ))}
      </motion.div>

      {/* Shortcut hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-3 text-xs text-[var(--text-secondary)] flex items-center gap-1"
      >
        <Zap size={10} />
        <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--bg-secondary)] border border-[var(--border)]">Ctrl+K</kbd>
        로 어디서든 빠르게 검색
      </motion.p>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex gap-4"
      >
        <button
          onClick={() => setCurrentPage('collections')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
        >
          <FolderOpen size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
          <span className="text-sm">내 컬렉션</span>
        </button>
        <button
          onClick={() => setCurrentPage('trending')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
        >
          <TrendingUp size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
          <span className="text-sm">트렌딩</span>
        </button>
      </motion.div>

      {/* Recent searches */}
      {searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 w-full max-w-2xl"
        >
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
            <Clock size={14} />
            최근 검색
          </h2>
          <div className="space-y-1">
            {searchHistory.slice(0, 5).map((h, i) => (
              <motion.button
                key={h.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.05 }}
                onClick={() => onSearch(h.query)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-all group"
              >
                <span className="text-sm">{h.query}</span>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span>{h.result_count}건</span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
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
