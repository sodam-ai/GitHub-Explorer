import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, FolderOpen, Inbox, X } from 'lucide-react';
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
    if (selectedId) getCollectionItems(selectedId).then(setItems);
    else setItems([]);
  }, [selectedId]);

  async function handleCreate() {
    if (!newName.trim()) return;
    await createCollection(newName.trim());
    setNewName('');
    setShowCreate(false);
    loadCollections();
    toast.success(`"${newName.trim()}" 생성됨`);
  }

  async function handleDelete(id: string, name: string) {
    await deleteCollection(id);
    if (selectedId === id) setSelectedId(null);
    loadCollections();
    toast.success(`"${name}" 삭제됨`);
  }

  const selected = collections.find((c) => c.id === selectedId);

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{
        width: 260, borderRight: '1px solid var(--border)',
        background: 'var(--bg-card)', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setCurrentPage('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12 }}
          >
            <ArrowLeft size={14} />
            뒤로
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>컬렉션</h2>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 10 }}>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedId(col.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 10, marginBottom: 4, textAlign: 'left',
                cursor: 'pointer', border: 'none', transition: 'all 0.12s',
                background: selectedId === col.id ? 'var(--accent-muted)' : 'transparent',
                color: selectedId === col.id ? 'var(--accent)' : 'var(--text-primary)',
              }}
              className={selectedId !== col.id ? 'hover:bg-[var(--bg-secondary)]' : ''}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <FolderOpen size={15} style={{ color: col.color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {col.name}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(col.id, col.name); }}
                style={{ opacity: 0, padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', transition: 'opacity 0.12s' }}
                className="group-hover:opacity-100 hover:text-red-500"
                onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '0'; }}
              >
                <Trash2 size={13} />
              </button>
            </button>
          ))}

          {collections.length === 0 && !showCreate && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Inbox size={28} style={{ color: 'var(--text-tertiary)', opacity: 0.3, margin: '0 auto 8px' }} />
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>아직 컬렉션이 없어요</p>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
          <AnimatePresence>
            {showCreate ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowCreate(false); }}
                    placeholder="이름 입력"
                    autoFocus
                    style={{
                      flex: 1, padding: '8px 12px', fontSize: 13, borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleCreate}
                    style={{
                      padding: '8px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8,
                      background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer',
                    }}
                  >
                    추가
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px 0', fontSize: 13, fontWeight: 500, borderRadius: 8,
                  border: '1px dashed var(--border)', background: 'transparent',
                  color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'all 0.12s',
                }}
                className="hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Plus size={14} />
                새 컬렉션
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {selected ? (
          <div style={{ width: '100%', maxWidth: 600, padding: '32px 32px 60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <FolderOpen size={20} style={{ color: selected.color }} />
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>{selected.name}</h1>
            </div>

            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, background: 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px',
                }}>
                  <Inbox size={24} style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>아직 저장된 저장소가 없습니다</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>검색 결과에서 "저장" 버튼을 눌러 추가하세요</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', borderRadius: 12,
                      border: '1px solid var(--border)', background: 'var(--bg-card)',
                    }}
                    className="card-hover"
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{item.repository_id}</p>
                      {item.memo && (
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{item.memo}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20, background: 'var(--bg-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <FolderOpen size={32} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
            </div>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>컬렉션을 선택하세요</p>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6 }}>왼쪽에서 선택하거나 새로 만드세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
