import { create } from 'zustand';
import type { SearchResult, SearchHistory, SearchTab, Theme } from '@/types';

type AccentColor = 'blue' | 'violet' | 'emerald' | 'rose' | 'amber' | 'cyan';

const ACCENT_COLORS: Record<AccentColor, { main: string; hover: string; muted: string }> = {
  blue:    { main: '#2563eb', hover: '#1d4ed8', muted: '#dbeafe' },
  violet:  { main: '#7c3aed', hover: '#6d28d9', muted: '#ede9fe' },
  emerald: { main: '#059669', hover: '#047857', muted: '#d1fae5' },
  rose:    { main: '#e11d48', hover: '#be123c', muted: '#ffe4e6' },
  amber:   { main: '#d97706', hover: '#b45309', muted: '#fef3c7' },
  cyan:    { main: '#0891b2', hover: '#0e7490', muted: '#cffafe' },
};

const ACCENT_COLORS_DARK: Record<AccentColor, { main: string; hover: string; muted: string }> = {
  blue:    { main: '#3b82f6', hover: '#60a5fa', muted: '#172554' },
  violet:  { main: '#8b5cf6', hover: '#a78bfa', muted: '#2e1065' },
  emerald: { main: '#10b981', hover: '#34d399', muted: '#064e3b' },
  rose:    { main: '#fb7185', hover: '#fda4af', muted: '#4c0519' },
  amber:   { main: '#f59e0b', hover: '#fbbf24', muted: '#451a03' },
  cyan:    { main: '#22d3ee', hover: '#67e8f9', muted: '#083344' },
};

function applyAccentColor(color: AccentColor, isDark: boolean) {
  const palette = isDark ? ACCENT_COLORS_DARK[color] : ACCENT_COLORS[color];
  document.documentElement.style.setProperty('--accent', palette.main);
  document.documentElement.style.setProperty('--accent-hover', palette.hover);
  document.documentElement.style.setProperty('--accent-muted', palette.muted);
}

interface AppState {
  // Theme
  theme: Theme;
  accentColor: AccentColor;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;

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
  currentPage: 'home' | 'search' | 'collections' | 'trending' | 'stats' | 'settings';
  setCurrentPage: (page: 'home' | 'search' | 'collections' | 'trending' | 'stats' | 'settings') => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Theme
  theme: (localStorage.getItem('theme') as Theme) || 'dark',
  accentColor: (localStorage.getItem('accent_color') as AccentColor) || 'blue',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      applyAccentColor(state.accentColor, newTheme === 'dark');
      return { theme: newTheme };
    }),
  setAccentColor: (color) =>
    set((state) => {
      localStorage.setItem('accent_color', color);
      applyAccentColor(color, state.theme === 'dark');
      return { accentColor: color };
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
