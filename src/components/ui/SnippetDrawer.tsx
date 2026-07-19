import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Trash2, Code, Inbox } from 'lucide-react';
import { useState } from 'react';
import { useSnippetStore } from '@/stores/snippet-store';

export function SnippetDrawer() {
  const { snippets, isOpen, setOpen, removeSnippet, clearSnippets } = useSnippetStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(id: string, code: string) {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-[var(--bg-card)] border-l border-[var(--border)] shadow-[var(--shadow-lg)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-12 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Code size={14} className="text-[var(--accent)]" />
                <span className="text-[13px] font-semibold">저장된 스니펫</span>
                <span className="badge bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">
                  {snippets.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {snippets.length > 0 && (
                  <button onClick={clearSnippets} className="btn btn-ghost p-1 text-[var(--text-tertiary)] hover:text-red-500" aria-label="스니펫 전체 삭제">
                    <Trash2 size={13} />
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="btn btn-ghost p-1">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {snippets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Inbox size={28} className="text-[var(--text-tertiary)] opacity-30 mb-2" />
                  <p className="text-[12px] text-[var(--text-tertiary)]">저장된 스니펫이 없습니다</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">코드 뷰어에서 저장할 수 있습니다</p>
                </div>
              )}

              {snippets.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] overflow-hidden group"
                >
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-[var(--bg-secondary)]">
                    <span className="text-[10px] text-[var(--text-tertiary)] truncate">
                      {s.repository} · {s.source}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleCopy(s.id, s.code)}
                        className="btn btn-ghost p-1"
                      >
                        {copiedId === s.id ? (
                          <Check size={11} className="text-green-500" />
                        ) : (
                          <Copy size={11} className="text-[var(--text-tertiary)]" />
                        )}
                      </button>
                      <button
                        onClick={() => removeSnippet(s.id)}
                        className="btn btn-ghost p-1 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={11} className="text-[var(--text-tertiary)] hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  <pre className="p-2.5 text-[10px] leading-[1.6] font-mono overflow-x-auto max-h-24">
                    <code>{s.code}</code>
                  </pre>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
