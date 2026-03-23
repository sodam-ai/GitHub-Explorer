import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Header } from '@/components/ui/Header';
import { CommandPalette } from '@/components/search/CommandPalette';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { CollectionPage } from '@/components/collection/CollectionPage';
import { searchRepositories, searchCode, searchIssues } from '@/lib/github';
import { generateSearchSummary } from '@/lib/ai';
import { saveSearchHistory, getSearchHistory, getSetting, isTauri } from '@/lib/tauri-bridge';
import type { SearchResult } from '@/types';
import './index.css';

function App() {
  const {
    theme,
    currentPage,
    setCurrentPage,
    setIsSearching,
    setSearchResult,
    setSearchQuery,
    addSearchHistory,
  } = useAppStore();

  // 테마 초기화
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
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
        // GitHub 토큰 가져오기 (DB 우선, localStorage fallback)
        let ghToken: string | undefined;
        if (isTauri()) {
          ghToken = (await getSetting('github_token')) || undefined;
        }
        if (!ghToken) {
          ghToken = localStorage.getItem('github_token') || undefined;
        }

        const [repoRes, codeRes, issueRes] = await Promise.allSettled([
          searchRepositories(query, ghToken),
          searchCode(query, ghToken),
          searchIssues(query, ghToken),
        ]);

        const repositories =
          repoRes.status === 'fulfilled' ? repoRes.value.items : [];
        const code_results =
          codeRes.status === 'fulfilled' ? codeRes.value.items : [];
        const issue_results =
          issueRes.status === 'fulfilled' ? issueRes.value.items : [];

        // AI 요약 생성 (DB 우선, localStorage fallback)
        let apiKey = '';
        if (isTauri()) {
          apiKey = (await getSetting('openai_api_key')) || '';
        }
        if (!apiKey) {
          apiKey = localStorage.getItem('openai_api_key') || '';
        }
        const ai_summary = await generateSearchSummary(query, repositories, apiKey);

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

  return (
    <>
      <Header />
      <CommandPalette />

      {currentPage === 'home' && <HomePage onSearch={handleSearch} />}
      {currentPage === 'search' && <SearchPage onSearch={handleSearch} />}
      {currentPage === 'collections' && <CollectionPage />}
      {currentPage === 'settings' && <SettingsPage />}
    </>
  );
}

export default App;
