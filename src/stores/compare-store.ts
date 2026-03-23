import { create } from 'zustand';
import type { Repository } from '@/types';

export interface CompareRecord {
  id: string;
  repos: Repository[];
  created_at: string;
}

interface CompareState {
  history: CompareRecord[];
  addRecord: (repos: Repository[]) => void;
  removeRecord: (id: string) => void;
  clearHistory: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  history: JSON.parse(localStorage.getItem('compare_history') || '[]'),
  addRecord: (repos) =>
    set((state) => {
      const record: CompareRecord = {
        id: crypto.randomUUID(),
        repos,
        created_at: new Date().toISOString(),
      };
      const updated = [record, ...state.history].slice(0, 20);
      localStorage.setItem('compare_history', JSON.stringify(updated));
      return { history: updated };
    }),
  removeRecord: (id) =>
    set((state) => {
      const updated = state.history.filter((r) => r.id !== id);
      localStorage.setItem('compare_history', JSON.stringify(updated));
      return { history: updated };
    }),
  clearHistory: () => {
    localStorage.removeItem('compare_history');
    set({ history: [] });
  },
}));
