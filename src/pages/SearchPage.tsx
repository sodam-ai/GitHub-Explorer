import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useAppStore } from '@/stores/app-store';

interface SearchPageProps {
  onSearch: (query: string) => void;
}

export function SearchPage({ onSearch }: SearchPageProps) {
  const { searchResult, isSearching, searchQuery } = useAppStore();

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-center"
      >
        <SearchBar onSearch={onSearch} />
      </motion.div>

      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center mb-4">
            <p className="text-sm text-[var(--text-secondary)]">
              "<span className="text-[var(--accent)]">{searchQuery}</span>" 검색 중...
            </p>
          </div>
          <SkeletonList count={4} />
        </motion.div>
      )}

      {!isSearching && searchResult && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SearchResults />
        </motion.div>
      )}

      {!isSearching && !searchResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <Search size={48} className="text-[var(--border)] mb-4" />
          <p className="text-[var(--text-secondary)]">검색어를 입력하세요</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">자연어로 GitHub를 검색할 수 있습니다</p>
        </motion.div>
      )}
    </div>
  );
}
