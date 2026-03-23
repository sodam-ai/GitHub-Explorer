import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, Clock, Moon, Sun, FolderOpen, TrendingUp, ArrowRight, Command } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

interface Action {
  id: string;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  section: string;
  action: () => void;
}

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    searchHistory,
    theme,
    toggleTheme,
    setCurrentPage,
    setSearchQuery,
  } = useAppStore();
  const [input, setInput] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = [
    ...(input.trim()
      ? [
          {
            id: 'search',
            icon: <Search size={14} />,
            label: `"${input}" 검색`,
            section: '검색',
            action: () => {
              setSearchQuery(input.trim());
              setCurrentPage('search');
            },
          },
        ]
      : []),
    {
      id: 'collections',
      icon: <FolderOpen size={14} />,
      label: '컬렉션',
      hint: '저장한 저장소 관리',
      section: '이동',
      action: () => setCurrentPage('collections'),
    },
    {
      id: 'trending',
      icon: <TrendingUp size={14} />,
      label: '트렌딩',
      hint: '인기 저장소 보기',
      section: '이동',
      action: () => setCurrentPage('trending'),
    },
    {
      id: 'settings',
      icon: <Settings size={14} />,
      label: '설정',
      hint: 'API 키, 테마 관리',
      section: '이동',
      action: () => setCurrentPage('settings'),
    },
    {
      id: 'theme',
      icon: theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />,
      label: theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환',
      section: '액션',
      action: toggleTheme,
    },
    ...searchHistory.slice(0, 4).map((h) => ({
      id: `history-${h.id}`,
      icon: <Clock size={14} />,
      label: h.query,
      hint: `${h.result_count}건`,
      section: '최근 검색',
      action: () => {
        setSearchQuery(h.query);
        setCurrentPage('search');
      },
    })),
  ];

  const filtered = input.trim()
    ? actions.filter(
        (a) =>
          a.id === 'search' ||
          a.label.toLowerCase().includes(input.toLowerCase())
      )
    : actions;

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setInput('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [input]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = useCallback(
    (action: Action) => {
      setCommandPaletteOpen(false);
      action.action();
    },
    [setCommandPaletteOpen]
  );

  function handleKeyNav(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      handleSelect(filtered[activeIndex]);
    }
  }

  // Group by section
  const sections: Record<string, Action[]> = {};
  filtered.forEach((a) => {
    if (!sections[a.section]) sections[a.section] = [];
    sections[a.section].push(a);
  });

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh] bg-black/40 backdrop-blur-[2px]"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0, 1] }}
            className="w-full max-w-[480px] mx-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-2.5 px-4 h-12 border-b border-[var(--border)]">
              <Command size={14} className="text-[var(--text-tertiary)] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyNav}
                placeholder="명령어 또는 검색어 입력..."
                className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-[var(--text-tertiary)]"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-tertiary)] font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto py-1.5">
              {Object.entries(sections).map(([section, items]) => (
                <div key={section}>
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                      {section}
                    </span>
                  </div>
                  {items.map((item) => {
                    const globalIndex = filtered.indexOf(item);
                    const isActive = globalIndex === activeIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-[13px] transition-colors ${
                          isActive
                            ? 'bg-[var(--accent)] text-white'
                            : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                        }`}
                        style={{ width: 'calc(100% - 12px)' }}
                      >
                        <span className={isActive ? 'text-white/70' : 'text-[var(--text-tertiary)]'}>
                          {item.icon}
                        </span>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {item.hint && (
                          <span className={`text-[11px] ${isActive ? 'text-white/50' : 'text-[var(--text-tertiary)]'}`}>
                            {item.hint}
                          </span>
                        )}
                        {isActive && <ArrowRight size={12} className="text-white/50" />}
                      </button>
                    );
                  })}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-[13px] text-[var(--text-tertiary)]">결과 없음</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-4 h-8 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
              <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
                <kbd className="px-1 py-px rounded bg-[var(--bg-card)] border border-[var(--border)] text-[9px] font-mono">↑↓</kbd>
                이동
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
                <kbd className="px-1 py-px rounded bg-[var(--bg-card)] border border-[var(--border)] text-[9px] font-mono">↵</kbd>
                선택
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
