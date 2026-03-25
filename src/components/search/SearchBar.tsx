import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

interface SearchBarProps {
  onSearch: (query: string) => void;
  large?: boolean;
}

const POPULAR_TOPICS = [
  'React hooks', 'TypeScript utility', 'Python automation', 'Rust CLI',
  'Next.js template', 'AI agent framework', 'Docker compose', 'GraphQL API',
  'Tailwind components', 'Node.js backend', 'Go microservice', 'Vue 3 starter',
];

export function SearchBar({ onSearch, large = false }: SearchBarProps) {
  const { searchQuery, setSearchQuery, isSearching, searchHistory } = useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [focused, setFocused] = useState(false);

  // 외부에서 searchQuery가 변경되면 localQuery 동기화
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    if (!q) return [];

    const fromHistory = searchHistory
      .filter((h) => h.query.toLowerCase().includes(q) && h.query.toLowerCase() !== q)
      .slice(0, 3)
      .map((h) => ({ type: 'history' as const, text: h.query, count: h.result_count }));

    const fromTopics = POPULAR_TOPICS
      .filter((t) => t.toLowerCase().includes(q) && !fromHistory.find((h) => h.text.toLowerCase() === t.toLowerCase()))
      .slice(0, 3)
      .map((t) => ({ type: 'topic' as const, text: t, count: 0 }));

    return [...fromHistory, ...fromTopics].slice(0, 5);
  }, [localQuery, searchHistory]);

  const showSuggestions = focused && suggestions.length > 0 && !isSearching;

  useEffect(() => {
    setActiveIndex(-1);
  }, [localQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = activeIndex >= 0 ? suggestions[activeIndex]?.text : localQuery;
      const trimmed = (text || '').trim();

      // 빈 검색어라도 필터가 설정되어 있으면 허용
      const hasFilters = useAppStore.getState().searchFilters;
      const hasAnyFilter = hasFilters.owner || hasFilters.language || hasFilters.license || hasFilters.minStars > 0;
      if (!trimmed && !hasAnyFilter) return;

      setLocalQuery(trimmed);
      setSearchQuery(trimmed);
      setFocused(false);
      onSearch(trimmed);
    },
    [localQuery, activeIndex, suggestions, setSearchQuery, onSearch]
  );

  function selectSuggestion(text: string) {
    setLocalQuery(text);
    setSearchQuery(text);
    setFocused(false);
    onSearch(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  }

  return (
    <div ref={wrapperRef} className={`relative w-full ${large ? 'max-w-xl' : 'max-w-md'}`}>
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center border-2 transition-all ${
            showSuggestions ? 'rounded-t-2xl rounded-b-none border-b-transparent' : 'rounded-2xl'
          } ${
            focused
              ? 'border-[var(--accent)] shadow-[0_0_0_4px_var(--accent-muted)]'
              : 'border-[var(--border)] shadow-[var(--shadow-lg)]'
          } bg-[var(--bg-elevated)]`}
        >
          <div className={`absolute text-[var(--text-tertiary)] ${large ? 'left-6' : 'left-4'}`}>
            {isSearching ? (
              <Loader2 size={large ? 20 : 15} className="animate-spin text-[var(--accent)]" />
            ) : (
              <Search size={large ? 20 : 15} />
            )}
          </div>
          <input
            type="text"
            aria-label="검색어 입력"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={large ? '무엇을 찾고 계세요?' : '검색...'}
            className={`w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] ${
              large ? 'pl-14 pr-16 py-5 text-[16px]' : 'pl-10 pr-11 py-3 text-[14px]'
            }`}
            disabled={isSearching}
          />
          <button
            type="submit"
            aria-label="검색"
            disabled={isSearching || !localQuery.trim()}
            className={`absolute right-3.5 flex items-center justify-center rounded-xl bg-[var(--accent)] text-white disabled:opacity-30 transition-all hover:bg-[var(--accent-hover)] ${
              large ? 'w-11 h-11' : 'w-8 h-8'
            }`}
          >
            <ArrowRight size={large ? 18 : 13} />
          </button>
        </div>
      </form>

      {/* Autocomplete dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute z-40 w-full bg-[var(--bg-elevated)] border-2 border-t-0 border-[var(--accent)] rounded-b-2xl shadow-[var(--shadow-lg)] overflow-hidden"
          >
            <div className="py-1">
              {suggestions.map((s, i) => (
                <button
                  key={s.text}
                  onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s.text); }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors ${
                    i === activeIndex ? 'bg-[var(--accent-muted)] text-[var(--accent)]' : 'hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {s.type === 'history' ? (
                    <Clock size={12} className={i === activeIndex ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
                  ) : (
                    <Sparkles size={12} className={i === activeIndex ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
                  )}
                  <span className="flex-1 text-left truncate">{s.text}</span>
                  {s.count > 0 && (
                    <span className="text-[10px] text-[var(--text-tertiary)]">{s.count}건</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
