import { create } from 'zustand';
import type { SearchResult, SearchHistory, SearchTab, Theme } from '@/types';

interface AppState {
  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResult: SearchResult | null;
  setSearchResult: (result: SearchResult | null) => void;
  isSearching: boolean;
  setIsSearching: (loading: boolean) => void;
  activeTab: SearchTab;
  setActiveTab: (tab: SearchTab) => void;

  // Search History
  searchHistory: SearchHistory[];
  addSearchHistory: (entry: SearchHistory) => void;
  clearSearchHistory: () => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Settings
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  // Current Page
  currentPage: 'home' | 'search' | 'collections' | 'settings';
  setCurrentPage: (page: 'home' | 'search' | 'collections' | 'settings') => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Theme
  theme: (localStorage.getItem('theme') as Theme) || 'dark',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return { theme: newTheme };
    }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchResult: null,
  setSearchResult: (result) => set({ searchResult: result }),
  isSearching: false,
  setIsSearching: (loading) => set({ isSearching: loading }),
  activeTab: 'repositories',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Search History
  searchHistory: [],
  addSearchHistory: (entry) =>
    set((state) => ({
      searchHistory: [entry, ...state.searchHistory].slice(0, 50),
    })),
  clearSearchHistory: () => set({ searchHistory: [] }),

  // Command Palette
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  // Settings
  isSettingsOpen: false,
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  // Current Page
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),
}));
