import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { useAppStore } from '@/stores/app-store';

interface SearchPageProps {
  onSearch: (query: string) => void;
}

export function SearchPage({ onSearch }: SearchPageProps) {
  const { searchResult, isSearching } = useAppStore();

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <div className="mb-6 flex justify-center">
        <SearchBar onSearch={onSearch} />
      </div>

      {isSearching && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">AI가 검색 중입니다...</p>
        </div>
      )}

      {!isSearching && searchResult && <SearchResults />}

      {!isSearching && !searchResult && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-[var(--text-secondary)]">검색어를 입력하세요</p>
        </div>
      )}
    </div>
  );
}
