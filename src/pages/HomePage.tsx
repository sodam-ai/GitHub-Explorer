import { Search, Clock, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { SearchBar } from '@/components/search/SearchBar';

interface HomePageProps {
  onSearch: (query: string) => void;
}

export function HomePage({ onSearch }: HomePageProps) {
  const { searchHistory } = useAppStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[var(--accent)]/10 rounded-2xl">
          <Search size={32} className="text-[var(--accent)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">GitHub AI Explorer</h1>
          <p className="text-[var(--text-secondary)]">AI로 GitHub를 자연어 검색</p>
        </div>
      </div>

      <SearchBar onSearch={onSearch} large />

      <p className="mt-3 text-xs text-[var(--text-secondary)]">
        Ctrl+K 로 어디서든 빠르게 검색할 수 있습니다
      </p>

      {/* 최근 검색 */}
      {searchHistory.length > 0 && (
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
            <Clock size={14} />
            최근 검색
          </h2>
          <div className="space-y-1">
            {searchHistory.slice(0, 5).map((h) => (
              <button
                key={h.id}
                onClick={() => onSearch(h.query)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors group"
              >
                <span className="text-sm">{h.query}</span>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span>{h.result_count}건</span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
