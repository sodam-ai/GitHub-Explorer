import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Header } from '@/components/ui/Header';
import { CommandPalette } from '@/components/search/CommandPalette';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { searchRepositories, searchCode, searchIssues } from '@/lib/github';
import { generateSearchSummary } from '@/lib/ai';
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
        const [repoRes, codeRes, issueRes] = await Promise.allSettled([
          searchRepositories(query),
          searchCode(query),
          searchIssues(query),
        ]);

        const repositories =
          repoRes.status === 'fulfilled' ? repoRes.value.items : [];
        const code_results =
          codeRes.status === 'fulfilled' ? codeRes.value.items : [];
        const issue_results =
          issueRes.status === 'fulfilled' ? issueRes.value.items : [];

        // AI 요약 생성
        const apiKey = localStorage.getItem('openai_api_key') || '';
        const ai_summary = await generateSearchSummary(query, repositories, apiKey);

        const result: SearchResult = {
          repositories,
          code_results,
          issue_results,
          ai_summary,
          total_count: repositories.length + code_results.length + issue_results.length,
        };

        setSearchResult(result);

        // 검색 기록 저장
        addSearchHistory({
          id: crypto.randomUUID(),
          query,
          result_count: result.total_count,
          filters: null,
          searched_at: new Date().toISOString(),
        });
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
      {currentPage === 'settings' && <SettingsPage />}
    </>
  );
}

export default App;
