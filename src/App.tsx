import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { Header } from '@/components/ui/Header';
import { CommandPalette } from '@/components/search/CommandPalette';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { CollectionPage } from '@/components/collection/CollectionPage';
import { TrendingPage } from '@/pages/TrendingPage';
import { StatsPage } from '@/pages/StatsPage';
import { searchRepositories, searchCode, searchIssues } from '@/lib/github';
import { generateSearchSummary } from '@/lib/ai';
import { saveSearchHistory, getSearchHistory, getSecret, isTauri } from '@/lib/tauri-bridge';
import { isOnline, getCachedRepositories, cacheRepositories } from '@/lib/offline-cache';
import { Toaster, toast } from 'sonner';
import { Onboarding } from '@/components/ui/Onboarding';
import { SnippetDrawer } from '@/components/ui/SnippetDrawer';
import type { SearchResult } from '@/types';
import './index.css';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('onboarding_done')
  );

  const {
    theme,
    currentPage,
    setCurrentPage,
    setIsSearching,
    setSearchResult,
    setSearchQuery,
    addSearchHistory,
    searchQuery: currentSearchQuery,
  } = useAppStore();

  // 테마 + accent color 초기화
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // accent color CSS 변수만 다시 적용 (스토어 업데이트 X)
    const { accentColor } = useAppStore.getState();
    const root = document.documentElement;
    const isDark = theme === 'dark';
    const palette: Record<string, Record<string, { m: string; h: string; mu: string }>> = {
      light: { blue: { m: '#2563eb', h: '#1d4ed8', mu: '#dbeafe' }, violet: { m: '#7c3aed', h: '#6d28d9', mu: '#ede9fe' }, emerald: { m: '#059669', h: '#047857', mu: '#d1fae5' }, rose: { m: '#e11d48', h: '#be123c', mu: '#ffe4e6' }, amber: { m: '#d97706', h: '#b45309', mu: '#fef3c7' }, cyan: { m: '#0891b2', h: '#0e7490', mu: '#cffafe' } },
      dark: { blue: { m: '#3b82f6', h: '#60a5fa', mu: '#172554' }, violet: { m: '#8b5cf6', h: '#a78bfa', mu: '#2e1065' }, emerald: { m: '#10b981', h: '#34d399', mu: '#064e3b' }, rose: { m: '#fb7185', h: '#fda4af', mu: '#4c0519' }, amber: { m: '#f59e0b', h: '#fbbf24', mu: '#451a03' }, cyan: { m: '#22d3ee', h: '#67e8f9', mu: '#083344' } },
    };
    const p = palette[isDark ? 'dark' : 'light'][accentColor] || palette[isDark ? 'dark' : 'light'].blue;
    root.style.setProperty('--accent', p.m);
    root.style.setProperty('--accent-hover', p.h);
    root.style.setProperty('--accent-muted', p.mu);
  }, [theme]);

  // DB에서 검색 히스토리 로드
  useEffect(() => {
    if (isTauri()) {
      getSearchHistory(50).then((history) => {
        if (history.length > 0) {
          useAppStore.setState({ searchHistory: history });
        }
      });
    }
  }, []);

  // 키보드 단축키
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setCurrentPage('settings');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentPage]);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      setCurrentPage('search');
      setIsSearching(true);
      setSearchResult(null);

      try {
        const online = await isOnline();

        let repositories: SearchResult['repositories'] = [];
        let code_results: SearchResult['code_results'] = [];
        let issue_results: SearchResult['issue_results'] = [];
        let ai_summary = '';

        if (online) {
          // 온라인: GitHub API 검색
          const ghToken = (await getSecret('github_token')) || undefined;

          // 필터를 GitHub API에 전달
          const currentFilters = useAppStore.getState().searchFilters;
          const searchOpts = {
            owner: currentFilters.owner || undefined,
            language: currentFilters.language || undefined,
            license: currentFilters.license || undefined,
            minStars: currentFilters.minStars || undefined,
            minForks: currentFilters.minForks || undefined,
            updatedAfter: currentFilters.updatedAfter || undefined,
            excludeArchived: currentFilters.excludeArchived || undefined,
            sortBy: currentFilters.sortBy || undefined,
          };

          const [repoRes, codeRes, issueRes] = await Promise.allSettled([
            searchRepositories(query, ghToken, 1, 20, searchOpts),
            searchCode(query, ghToken),
            searchIssues(query, ghToken),
          ]);

          repositories = repoRes.status === 'fulfilled' ? repoRes.value.items : [];
          code_results = codeRes.status === 'fulfilled' ? codeRes.value.items : [];
          issue_results = issueRes.status === 'fulfilled' ? issueRes.value.items : [];

          // 검색 결과 캐시 저장
          if (repositories.length > 0) {
            cacheRepositories(repositories);
          }

          // AI 요약 생성
          const apiKey = (await getSecret('openai_api_key')) || '';
          ai_summary = await generateSearchSummary(query, repositories, apiKey);
        } else {
          // 오프라인: 캐시 검색
          repositories = await getCachedRepositories(query);
          ai_summary = `오프라인 모드: 캐시된 저장소 ${repositories.length}개에서 검색했습니다. 인터넷 연결 시 더 많은 결과를 볼 수 있습니다.`;
        }

        const result: SearchResult = {
          repositories,
          code_results,
          issue_results,
          ai_summary,
          total_count: repositories.length + code_results.length + issue_results.length,
        };

        setSearchResult(result);

        // 검색 기록 저장 (메모리 + DB)
        const historyEntry = {
          id: crypto.randomUUID(),
          query,
          result_count: result.total_count,
          filters: null,
          searched_at: new Date().toISOString(),
        };
        addSearchHistory(historyEntry);
        if (isTauri()) {
          saveSearchHistory(historyEntry);
        }
      } catch (error) {
        console.error('Search error:', error);
        toast.error('검색 중 오류가 발생했습니다', {
          description: error instanceof Error ? error.message : '알 수 없는 오류',
        });
        setSearchResult({
          repositories: [],
          code_results: [],
          issue_results: [],
          ai_summary: `검색 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          total_count: 0,
        });
      } finally {
        setIsSearching(false);
      }
    },
    [setSearchQuery, setCurrentPage, setIsSearching, setSearchResult, addSearchHistory]
  );

  const handleLoadMore = useCallback(async () => {
    const store = useAppStore.getState();
    if (store.isLoadingMore || !store.searchResult || !currentSearchQuery) return;

    const nextPage = store.searchPage + 1;
    store.setIsLoadingMore(true);

    try {
      const ghToken = (await getSecret('github_token')) || undefined;

      const currentFilters = store.searchFilters;
      const searchOpts = {
        owner: currentFilters.owner || undefined,
        language: currentFilters.language || undefined,
        license: currentFilters.license || undefined,
        minStars: currentFilters.minStars || undefined,
        minForks: currentFilters.minForks || undefined,
        updatedAfter: currentFilters.updatedAfter || undefined,
        excludeArchived: currentFilters.excludeArchived || undefined,
        sortBy: currentFilters.sortBy || undefined,
      };

      const repoRes = await searchRepositories(currentSearchQuery, ghToken, nextPage, 20, searchOpts);
      if (repoRes.items.length > 0) {
        store.appendRepositories(repoRes.items);
        store.setSearchPage(nextPage);
      }
    } catch (e) {
      console.error('Load more error:', e);
    } finally {
      store.setIsLoadingMore(false);
    }
  }, [currentSearchQuery]);

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          },
        }}
      />
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      </AnimatePresence>

      <Header />
      <CommandPalette />

      {currentPage === 'home' && <HomePage onSearch={handleSearch} />}
      {currentPage === 'search' && <SearchPage onSearch={handleSearch} onLoadMore={handleLoadMore} />}
      {currentPage === 'collections' && <CollectionPage />}
      {currentPage === 'trending' && <TrendingPage />}
      {currentPage === 'stats' && <StatsPage />}
      {currentPage === 'settings' && <SettingsPage />}

      <SnippetDrawer />
    </>
  );
}

export default App;
