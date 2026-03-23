import { create } from 'zustand';

export interface Snippet {
  id: string;
  code: string;
  language: string;
  source: string;
  repository: string;
  created_at: string;
}

interface SnippetState {
  snippets: Snippet[];
  isOpen: boolean;
  addSnippet: (snippet: Omit<Snippet, 'id' | 'created_at'>) => void;
  removeSnippet: (id: string) => void;
  clearSnippets: () => void;
  setOpen: (open: boolean) => void;
}

export const useSnippetStore = create<SnippetState>((set) => ({
  snippets: JSON.parse(localStorage.getItem('snippets') || '[]'),
  isOpen: false,
  addSnippet: (snippet) =>
    set((state) => {
      const entry: Snippet = {
        ...snippet,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      const updated = [entry, ...state.snippets].slice(0, 50);
      localStorage.setItem('snippets', JSON.stringify(updated));
      return { snippets: updated };
    }),
  removeSnippet: (id) =>
    set((state) => {
      const updated = state.snippets.filter((s) => s.id !== id);
      localStorage.setItem('snippets', JSON.stringify(updated));
      return { snippets: updated };
    }),
  clearSnippets: () => {
    localStorage.removeItem('snippets');
    set({ snippets: [] });
  },
  setOpen: (open) => set({ isOpen: open }),
}));
