import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, Sun, Moon, FolderOpen, TrendingUp, BarChart3, Code } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useSnippetStore } from '@/stores/snippet-store';

export function Header() {
  const { theme, toggleTheme, setCommandPaletteOpen, setCurrentPage, currentPage } = useAppStore();
  const snippetStore = useSnippetStore();

  const navItems = [
    { page: 'collections' as const, icon: FolderOpen, label: '컬렉션' },
    { page: 'trending' as const, icon: TrendingUp, label: '트렌딩' },
    { page: 'stats' as const, icon: BarChart3, label: '통계' },
  ];

  return (
    <header className="flex items-center justify-between px-8 h-16 border-b border-[var(--border)] bg-[var(--bg-card)]">
      {/* Logo */}
      <button
        onClick={() => setCurrentPage('home')}
        className="flex items-center gap-2.5 font-semibold text-[14px] hover:opacity-70 transition-opacity"
      >
        <div className="w-7 h-7 bg-[var(--accent)] rounded-lg flex items-center justify-center">
          <Search size={13} className="text-white" />
        </div>
        <span className="hidden sm:inline tracking-tight">GitHub AI Explorer</span>
      </button>

      {/* Center nav */}
      <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-xl p-1">
        {navItems.map(({ page, icon: Icon, label }) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              currentPage === page
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {currentPage === page && (
              <motion.div
                layoutId="nav-bg"
                className="absolute inset-0 bg-[var(--bg-card)] rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={14} />
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--border)] text-[12px] text-[var(--text-tertiary)] hover:border-[var(--text-tertiary)] transition-colors"
        >
          <Search size={12} />
          <span className="hidden sm:inline">검색...</span>
          <kbd className="ml-1 px-1 py-px text-[10px] rounded bg-[var(--bg-secondary)] border border-[var(--border)] font-mono leading-none">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => snippetStore.setOpen(true)}
          className="btn btn-ghost p-1.5 relative"
          title="저장된 스니펫"
        >
          <Code size={14} />
          {snippetStore.snippets.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-[8px] font-bold bg-[var(--accent)] text-white rounded-full flex items-center justify-center">
              {snippetStore.snippets.length}
            </span>
          )}
        </button>

        <div className="divider" />

        <button
          onClick={toggleTheme}
          className="btn btn-ghost p-1.5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ scale: 0.5, opacity: 0, rotate: -60 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 60 }}
              transition={{ duration: 0.15 }}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </motion.div>
          </AnimatePresence>
        </button>

        <button
          onClick={() => setCurrentPage('settings')}
          className={`btn btn-ghost p-1.5 ${currentPage === 'settings' ? 'text-[var(--accent)]' : ''}`}
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
}
