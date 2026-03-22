import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, Settings, Clock, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

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
    (action: string, value?: string) => {
      setCommandPaletteOpen(false);
      switch (action) {
        case 'search':
          if (value) {
            setSearchQuery(value);
            setCurrentPage('search');
          }
          break;
        case 'settings':
          setCurrentPage('settings');
          break;
        case 'toggle-theme':
          toggleTheme();
          break;
      }
    },
    [setCommandPaletteOpen, setSearchQuery, setCurrentPage, toggleTheme]
  );

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={16} className="text-[var(--text-secondary)]" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim()) {
                handleSelect('search', input.trim());
              }
            }}
            placeholder="입력하세요..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <div className="max-h-64 overflow-y-auto py-2">
          {input.trim() && (
            <button
              onClick={() => handleSelect('search', input.trim())}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <Search size={14} className="text-[var(--text-secondary)]" />
              <span>검색: {input}</span>
            </button>
          )}

          <button
            onClick={() => handleSelect('settings')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Settings size={14} className="text-[var(--text-secondary)]" />
            <span>설정 열기</span>
          </button>

          <button
            onClick={() => handleSelect('toggle-theme')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-secondary)] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun size={14} className="text-[var(--text-secondary)]" />
            ) : (
              <Moon size={14} className="text-[var(--text-secondary)]" />
            )}
            <span>{theme === 'dark' ? '라이트 모드' : '다크 모드'} 전환</span>
          </button>

          {searchHistory.length > 0 && (
            <>
              <div className="px-4 py-1.5 text-xs text-[var(--text-secondary)] font-medium">
                최근 검색
              </div>
              {searchHistory.slice(0, 5).map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleSelect('search', h.query)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <Clock size={14} className="text-[var(--text-secondary)]" />
                  <span>{h.query}</span>
                  <span className="ml-auto text-xs text-[var(--text-secondary)]">
                    {h.result_count}건
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
