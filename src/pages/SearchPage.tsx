import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useAppStore } from '@/stores/app-store';

interface SearchPageProps {
  onSearch: (query: string) => void;
  onLoadMore?: () => void;
}

export function SearchPage({ onSearch, onLoadMore }: SearchPageProps) {
  const { searchResult, isSearching, searchQuery, isLoadingMore } = useAppStore();

  const sentinelRef = useInfiniteScroll(
    () => onLoadMore?.(),
    { enabled: !!searchResult && !isSearching && !isLoadingMore && !!onLoadMore }
  );

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 780, padding: '28px 32px 60px' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <SearchBar onSearch={onSearch} />
        </div>

        {isSearching && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 20 }}>
              "<span style={{ color: 'var(--accent)' }}>{searchQuery}</span>" 검색 중...
            </p>
            <SkeletonList count={4} />
          </motion.div>
        )}

        {!isSearching && searchResult && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <SearchResults onReSearch={() => onSearch(searchQuery)} />

            {/* 무한 스크롤 감지 영역 */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {isLoadingMore && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                <Loader2 size={20} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
              </div>
            )}
          </motion.div>
        )}

        {!isSearching && !searchResult && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0' }}>
            <Search size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
            <p style={{ fontSize: 15, color: 'var(--text-tertiary)' }}>검색어를 입력하세요</p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>자연어로 GitHub를 검색할 수 있습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
