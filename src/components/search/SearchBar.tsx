import { useState, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

interface SearchBarProps {
  onSearch: (query: string) => void;
  large?: boolean;
}

export function SearchBar({ onSearch, large = false }: SearchBarProps) {
  const { searchQuery, setSearchQuery, isSearching } = useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

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
    <form onSubmit={handleSubmit} className={`w-full ${large ? 'max-w-2xl' : 'max-w-xl'}`}>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-[var(--text-secondary)]">
          {isSearching ? (
            <Loader2 size={large ? 22 : 18} className="animate-spin" />
          ) : (
            <Search size={large ? 22 : 18} />
          )}
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="자연어로 검색하세요... (예: React 드래그앤드롭 라이브러리)"
          className={`w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] ${
            large ? 'pl-12 pr-24 py-4 text-lg' : 'pl-10 pr-20 py-2.5 text-sm'
          }`}
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching || !localQuery.trim()}
          className={`absolute right-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
            large ? 'px-5 py-2 text-base' : 'px-3 py-1.5 text-sm'
          }`}
        >
          검색
        </button>
      </div>
    </form>
  );
}
