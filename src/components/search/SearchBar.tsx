import { useState, useCallback } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

interface SearchBarProps {
  onSearch: (query: string) => void;
  large?: boolean;
}

export function SearchBar({ onSearch, large = false }: SearchBarProps) {
  const { searchQuery, setSearchQuery, isSearching } = useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [focused, setFocused] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = localQuery.trim();
      if (!trimmed) return;
      setSearchQuery(trimmed);
      onSearch(trimmed);
    },
    [localQuery, setSearchQuery, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className={`w-full ${large ? 'max-w-xl' : 'max-w-md'}`}>
      <div
        className={`relative flex items-center rounded-xl border transition-all ${
          focused
            ? 'border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-muted)]'
            : 'border-[var(--border)] shadow-[var(--shadow-sm)]'
        } bg-[var(--bg-card)]`}
      >
        <div className="absolute left-3.5 text-[var(--text-tertiary)]">
          {isSearching ? (
            <Loader2 size={large ? 18 : 15} className="animate-spin text-[var(--accent)]" />
          ) : (
            <Search size={large ? 18 : 15} />
          )}
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={large ? '무엇을 찾고 계세요?' : '검색...'}
          className={`w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] ${
            large ? 'pl-11 pr-12 py-3.5 text-[15px]' : 'pl-9 pr-10 py-2 text-[13px]'
          }`}
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching || !localQuery.trim()}
          className={`absolute right-2 flex items-center justify-center rounded-lg bg-[var(--accent)] text-white disabled:opacity-30 transition-all hover:bg-[var(--accent-hover)] ${
            large ? 'w-8 h-8' : 'w-6 h-6'
          }`}
        >
          <ArrowRight size={large ? 16 : 13} />
        </button>
      </div>
    </form>
  );
}
