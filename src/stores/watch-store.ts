import { create } from 'zustand';

export interface WatchedRepo {
  id: string;
  full_name: string;
  last_checked: string;
  last_release: string | null;
  last_stars: number;
}

export interface WatchAlert {
  id: string;
  repo: string;
  type: 'release' | 'stars' | 'issue';
  message: string;
  created_at: string;
  read: boolean;
}

interface WatchState {
  watched: WatchedRepo[];
  alerts: WatchAlert[];
  addWatch: (repo: WatchedRepo) => void;
  removeWatch: (id: string) => void;
  addAlert: (alert: Omit<WatchAlert, 'id' | 'created_at' | 'read'>) => void;
  markRead: (id: string) => void;
  unreadCount: () => number;
}

export const useWatchStore = create<WatchState>((set, get) => ({
  watched: JSON.parse(localStorage.getItem('watched_repos') || '[]'),
  alerts: JSON.parse(localStorage.getItem('watch_alerts') || '[]'),
  addWatch: (repo) =>
    set((state) => {
      if (state.watched.find((w) => w.full_name === repo.full_name)) return state;
      const updated = [...state.watched, repo];
      localStorage.setItem('watched_repos', JSON.stringify(updated));
      return { watched: updated };
    }),
  removeWatch: (id) =>
    set((state) => {
      const updated = state.watched.filter((w) => w.id !== id);
      localStorage.setItem('watched_repos', JSON.stringify(updated));
      return { watched: updated };
    }),
  addAlert: (alert) =>
    set((state) => {
      const entry: WatchAlert = {
        ...alert,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        read: false,
      };
      const updated = [entry, ...state.alerts].slice(0, 50);
      localStorage.setItem('watch_alerts', JSON.stringify(updated));
      return { alerts: updated };
    }),
  markRead: (id) =>
    set((state) => {
      const updated = state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
      localStorage.setItem('watch_alerts', JSON.stringify(updated));
      return { alerts: updated };
    }),
  unreadCount: () => get().alerts.filter((a) => !a.read).length,
}));
