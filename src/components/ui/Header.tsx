import { motion } from 'framer-motion';
import { Search, Settings, Sun, Moon, FolderOpen, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Tooltip } from './Tooltip';

export function Header() {
  const { theme, toggleTheme, setCommandPaletteOpen, setCurrentPage, currentPage } = useAppStore();

  function NavButton({
    page,
    icon,
    label,
  }: {
    page: string;
    icon: React.ReactNode;
    label: string;
  }) {
    const isActive = currentPage === page;
    return (
      <Tooltip content={label}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(page as typeof currentPage)}
          className={`relative p-2 rounded-lg transition-colors ${
            isActive
              ? 'text-[var(--accent)] bg-[var(--accent)]/10'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {icon}
          {isActive && (
            <motion.div
              layoutId="nav-indicator"
              className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[var(--accent)] rounded-full"
            />
          )}
        </motion.button>
      </Tooltip>
    );
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCurrentPage('home')}
        className="flex items-center gap-2.5 text-lg font-semibold"
      >
        <div className="p-1.5 bg-gradient-to-br from-[var(--accent)] to-blue-600 rounded-lg">
          <Search size={16} className="text-white" />
        </div>
        <span className="hidden sm:inline">GitHub AI Explorer</span>
      </motion.button>

      <div className="flex items-center gap-1.5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <Search size={14} />
          <span className="hidden sm:inline">검색</span>
          <kbd className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono">
            Ctrl+K
          </kbd>
        </motion.button>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <NavButton page="collections" icon={<FolderOpen size={18} />} label="컬렉션 (Ctrl+B)" />
        <NavButton page="trending" icon={<TrendingUp size={18} />} label="트렌딩" />

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <Tooltip content={theme === 'dark' ? '라이트 모드' : '다크 모드'}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </motion.button>
        </Tooltip>

        <NavButton page="settings" icon={<Settings size={18} />} label="설정 (Ctrl+,)" />
      </div>
    </header>
  );
}
