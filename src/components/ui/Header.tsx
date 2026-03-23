import { Search, Settings, Sun, Moon, FolderOpen } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export function Header() {
  const { theme, toggleTheme, setCommandPaletteOpen, setCurrentPage } = useAppStore();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <button
        onClick={() => setCurrentPage('home')}
        className="flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-opacity"
      >
        <Search size={20} className="text-[var(--accent)]" />
        <span>GitHub AI Explorer</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] transition-colors"
        >
          <Search size={14} />
          <span>검색</span>
          <kbd className="ml-2 px-1.5 py-0.5 text-xs rounded bg-[var(--bg-primary)] border border-[var(--border)]">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={() => setCurrentPage('collections')}
          className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
          title="컬렉션"
        >
          <FolderOpen size={18} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
          title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={() => setCurrentPage('settings')}
          className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
          title="설정"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
