import { invoke } from '@tauri-apps/api/core';
import type { SearchHistory } from '@/types';

// --- Search History ---

export async function saveSearchHistory(entry: SearchHistory): Promise<void> {
  try {
    await invoke('save_search_history', {
      entry: {
        id: entry.id,
        query: entry.query,
        result_count: entry.result_count,
        filters: entry.filters ? JSON.stringify(entry.filters) : null,
        searched_at: entry.searched_at,
      },
    });
  } catch (e) {
    console.error('Failed to save search history to DB:', e);
  }
}

export async function getSearchHistory(limit = 50): Promise<SearchHistory[]> {
  try {
    const entries = await invoke<
      Array<{
        id: string;
        query: string;
        result_count: number;
        filters: string | null;
        searched_at: string;
      }>
    >('get_search_history', { limit });
    return entries.map((e) => ({
      ...e,
      filters: e.filters ? JSON.parse(e.filters) : null,
    }));
  } catch (e) {
    console.error('Failed to get search history from DB:', e);
    return [];
  }
}

export async function clearSearchHistoryDB(): Promise<void> {
  try {
    await invoke('clear_search_history');
  } catch (e) {
    console.error('Failed to clear search history in DB:', e);
  }
}

// --- Settings ---

export async function saveSetting(key: string, value: string): Promise<void> {
  try {
    await invoke('save_setting', { key, value });
  } catch (e) {
    console.error('Failed to save setting to DB:', e);
    // fallback to localStorage
    localStorage.setItem(key, value);
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const value = await invoke<string | null>('get_setting', { key });
    return value;
  } catch (e) {
    console.error('Failed to get setting from DB:', e);
    // fallback to localStorage
    return localStorage.getItem(key);
  }
}

// --- Utility ---

export function isTauri(): boolean {
  return '__TAURI_INTERNALS__' in window;
}
