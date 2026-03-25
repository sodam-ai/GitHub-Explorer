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
    <header role="banner" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', height: 64, borderBottom: '1px solid var(--border)',
      background: 'var(--bg-card)', flexShrink: 0,
    }}>
      {/* Logo */}
      <button
        onClick={() => setCurrentPage('home')}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontWeight: 600, fontSize: 16, cursor: 'pointer',
          background: 'none', border: 'none', color: 'inherit',
        }}
      >
        <div style={{
          width: 32, height: 32, background: 'var(--accent)', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Search size={16} color="white" />
        </div>
        <span>GitHub AI Explorer</span>
      </button>

      {/* Center nav */}
      <div role="navigation" aria-label="주요 내비게이션" style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 4,
      }}>
        {navItems.map(({ page, icon: Icon, label }) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
              cursor: 'pointer', border: 'none', background: 'transparent',
              color: currentPage === page ? 'var(--text-primary)' : 'var(--text-tertiary)',
              transition: 'color 0.15s',
            }}
          >
            {currentPage === page && (
              <motion.div
                layoutId="nav-bg"
                style={{
                  position: 'absolute', inset: 0, background: 'var(--bg-card)',
                  borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={16} />
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-tertiary)', cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          className="hover:border-[var(--accent)]"
        >
          <Search size={14} />
          <span>검색...</span>
          <kbd style={{
            marginLeft: 4, padding: '2px 6px', fontSize: 11,
            borderRadius: 5, background: 'var(--bg-secondary)',
            border: '1px solid var(--border)', fontFamily: 'monospace',
          }}>
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => snippetStore.setOpen(true)}
          style={{
            position: 'relative', padding: 8, borderRadius: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
          title="저장된 스니펫"
        >
          <Code size={18} />
          {snippetStore.snippets.length > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 16, height: 16, fontSize: 9, fontWeight: 700,
              background: 'var(--accent)', color: 'white', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {snippetStore.snippets.length}
            </span>
          )}
        </button>

        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

        <button
          onClick={toggleTheme}
          style={{
            padding: 8, borderRadius: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ scale: 0.5, opacity: 0, rotate: -60 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 60 }}
              transition={{ duration: 0.15 }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
          </AnimatePresence>
        </button>

        <button
          onClick={() => setCurrentPage('settings')}
          style={{
            padding: 8, borderRadius: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: currentPage === 'settings' ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
