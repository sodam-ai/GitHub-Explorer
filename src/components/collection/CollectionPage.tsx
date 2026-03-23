import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, FolderOpen } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
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

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

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
  }

  async function handleDelete(id: string) {
    await deleteCollection(id);
    if (selectedId === id) setSelectedId(null);
    loadCollections();
  }

  const selected = collections.find((c) => c.id === selectedId);

  return (
    <div className="flex-1 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--border)] p-4 flex flex-col gap-2">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-2 transition-colors"
        >
          <ArrowLeft size={16} />
          뒤로
        </button>

        <h2 className="text-lg font-semibold mb-2">내 컬렉션</h2>

        {collections.map((col) => (
          <div
            key={col.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedId === col.id
                ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                : 'hover:bg-[var(--bg-secondary)]'
            }`}
            onClick={() => setSelectedId(col.id)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FolderOpen size={14} style={{ color: col.color }} />
              <span className="text-sm truncate">{col.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(col.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {showCreate ? (
          <div className="flex gap-1 mt-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="컬렉션 이름"
              className="flex-1 px-2 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="px-2 py-1 text-xs bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-hover)]"
            >
              추가
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors mt-2"
          >
            <Plus size={14} />
            새 컬렉션
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {selected ? (
          <>
            <h1 className="text-2xl font-bold mb-1">{selected.name}</h1>
            {selected.description && (
              <p className="text-sm text-[var(--text-secondary)] mb-4">{selected.description}</p>
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--text-secondary)]">
                <FolderOpen size={48} className="mb-4 opacity-30" />
                <p>아직 저장된 저장소가 없습니다.</p>
                <p className="text-sm mt-1">검색 결과에서 북마크 버튼을 눌러 추가하세요.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-card)]"
                  >
                    <p className="text-sm font-medium">{item.repository_id}</p>
                    {item.memo && (
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{item.memo}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
            <FolderOpen size={64} className="mb-4 opacity-20" />
            <p className="text-lg">컬렉션을 선택하세요</p>
            <p className="text-sm mt-1">왼쪽에서 컬렉션을 선택하거나 새로 만드세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
