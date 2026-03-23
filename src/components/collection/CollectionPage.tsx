import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, FolderOpen, MoreHorizontal, Inbox } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import {
  getCollections,
  createCollection,
  deleteCollection,
  getCollectionItems,
  type Collection,
  type CollectionItem,
} from '@/lib/collections';

export function CollectionPage() {
  const { setCurrentPage } = useAppStore();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const loadCollections = useCallback(async () => {
    const list = await getCollections();
    setCollections(list);
  }, []);

  useEffect(() => { loadCollections(); }, [loadCollections]);

  useEffect(() => {
    if (selectedId) {
      getCollectionItems(selectedId).then(setItems);
    } else {
      setItems([]);
    }
  }, [selectedId]);

  async function handleCreate() {
    if (!newName.trim()) return;
    await createCollection(newName.trim());
    setNewName('');
    setShowCreate(false);
    loadCollections();
    toast.success(`"${newName.trim()}" 컬렉션이 생성되었습니다`);
  }

  async function handleDelete(id: string, name: string) {
    await deleteCollection(id);
    if (selectedId === id) setSelectedId(null);
    loadCollections();
    toast.success(`"${name}" 컬렉션이 삭제되었습니다`);
  }

  const selected = collections.find((c) => c.id === selectedId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex"
    >
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] bg-[var(--bg-card)] flex flex-col">
        <div className="p-3 border-b border-[var(--border)]">
          <button
            onClick={() => setCurrentPage('home')}
            className="btn btn-ghost text-[11px] -ml-1 mb-2"
          >
            <ArrowLeft size={13} />
            뒤로
          </button>
          <h2 className="text-[13px] font-semibold px-1">컬렉션</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedId(col.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all group ${
                selectedId === col.id
                  ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                  : 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FolderOpen size={13} style={{ color: col.color }} className="shrink-0" />
                <span className="text-[12px] truncate">{col.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(col.id, col.name);
                }}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-red-500 transition-all p-0.5"
              >
                <Trash2 size={11} />
              </button>
            </button>
          ))}

          {collections.length === 0 && !showCreate && (
            <div className="text-center py-8">
              <Inbox size={24} className="mx-auto text-[var(--text-tertiary)] opacity-40 mb-2" />
              <p className="text-[11px] text-[var(--text-tertiary)]">아직 컬렉션이 없어요</p>
            </div>
          )}
        </div>

        <div className="p-2 border-t border-[var(--border)]">
          <AnimatePresence>
            {showCreate ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-1.5 p-1">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreate();
                      if (e.key === 'Escape') setShowCreate(false);
                    }}
                    placeholder="이름 입력"
                    className="input-base text-[12px] py-1.5"
                    autoFocus
                  />
                  <button onClick={handleCreate} className="btn btn-primary text-[11px] px-2.5 py-1.5 shrink-0">
                    추가
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="w-full btn btn-ghost text-[12px] justify-start"
              >
                <Plus size={13} />
                새 컬렉션
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-6 max-w-2xl">
            <div className="flex items-center gap-2.5 mb-1">
              <FolderOpen size={16} style={{ color: selected.color }} />
              <h1 className="text-[18px] font-bold tracking-tight">{selected.name}</h1>
            </div>
            {selected.description && (
              <p className="text-[13px] text-[var(--text-secondary)] mb-5">{selected.description}</p>
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
                  <Inbox size={20} className="text-[var(--text-tertiary)]" />
                </div>
                <p className="text-[13px] text-[var(--text-secondary)]">아직 저장된 저장소가 없습니다</p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">검색 결과에서 "저장" 버튼을 눌러 추가하세요</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] card-hover group"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate">{item.repository_id}</p>
                      {item.memo && (
                        <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 truncate">{item.memo}</p>
                      )}
                    </div>
                    <button className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-1 transition-all">
                      <MoreHorizontal size={13} className="text-[var(--text-tertiary)]" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
              <FolderOpen size={28} className="text-[var(--text-tertiary)] opacity-40" />
            </div>
            <p className="text-[14px] text-[var(--text-secondary)]">컬렉션을 선택하세요</p>
            <p className="text-[12px] text-[var(--text-tertiary)] mt-1">왼쪽에서 선택하거나 새로 만드세요</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
