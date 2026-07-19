import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen, Plus, Star, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import {
  getCollections,
  createCollection,
  addRepositoryToCollection,
  type Collection,
} from '@/lib/collections';
import type { Repository } from '@/types';

interface BookmarkModalProps {
  repo: Repository;
  onClose: () => void;
}

export function BookmarkModal({ repo, onClose }: BookmarkModalProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCollections().then((list) => {
      if (!active) return;
      setCollections(list);
      if (list.length > 0) {
        setSelectedId(list[0].id);
      } else {
        setShowCreate(true);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function handleCreateInline() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      const created = await createCollection(trimmed);
      setCollections((prev) => [created, ...prev]);
      setSelectedId(created.id);
      setNewName('');
      setShowCreate(false);
    } catch (e) {
      toast.error('컬렉션 생성 실패', {
        description: e instanceof Error ? e.message : '알 수 없는 오류',
      });
    }
  }

  async function handleSave() {
    if (!selectedId) {
      toast.error('컬렉션을 선택하세요');
      return;
    }
    setSaving(true);
    try {
      await addRepositoryToCollection(selectedId, repo, memo.trim() || undefined);
      const target = collections.find((c) => c.id === selectedId);
      toast.success(`${target?.name ?? '컬렉션'}에 저장됨`, {
        description: repo.full_name,
      });
      onClose();
    } catch (e) {
      toast.error('저장 실패', {
        description: e instanceof Error ? e.message : '알 수 없는 오류',
      });
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 460,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-lg, 0 20px 40px rgba(0,0,0,0.3))',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '80vh',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--accent-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bookmark size={16} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                  컬렉션에 저장
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {repo.full_name} · <Star size={10} style={{ display: 'inline', verticalAlign: 'middle', color: '#f59e0b' }} /> {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                borderRadius: 6,
              }}
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
            {loading ? (
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)', padding: '20px 0' }}>
                불러오는 중...
              </p>
            ) : (
              <>
                {collections.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                    <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 4 }}>
                      컬렉션 선택
                    </label>
                    {collections.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => setSelectedId(col.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1px solid',
                          borderColor: selectedId === col.id ? 'var(--accent)' : 'var(--border)',
                          background: selectedId === col.id ? 'var(--accent-muted)' : 'transparent',
                          color: selectedId === col.id ? 'var(--accent)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: 13,
                          textAlign: 'left',
                          transition: 'all 0.12s',
                        }}
                      >
                        <FolderOpen size={14} style={{ color: col.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontWeight: 500 }}>{col.name}</span>
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: selectedId === col.id ? 'var(--accent)' : 'var(--border)',
                            background: selectedId === col.id ? 'var(--accent)' : 'transparent',
                            flexShrink: 0,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {showCreate ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden', marginBottom: 14 }}
                    >
                      <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 4, display: 'block' }}>
                        새 컬렉션 이름
                      </label>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCreateInline();
                            }
                            if (e.key === 'Escape' && collections.length > 0) {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowCreate(false);
                            }
                          }}
                          placeholder="예: React 도구들"
                          autoFocus
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: 13,
                            borderRadius: 8,
                            border: '1px solid var(--border)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                          }}
                        />
                        <button
                          onClick={handleCreateInline}
                          disabled={!newName.trim()}
                          style={{
                            padding: '8px 14px',
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 8,
                            background: newName.trim() ? 'var(--accent)' : 'var(--bg-secondary)',
                            color: newName.trim() ? 'white' : 'var(--text-tertiary)',
                            border: 'none',
                            cursor: newName.trim() ? 'pointer' : 'not-allowed',
                          }}
                        >
                          생성
                        </button>
                        {collections.length > 0 && (
                          <button
                            onClick={() => {
                              setShowCreate(false);
                              setNewName('');
                            }}
                            style={{
                              padding: 6,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => setShowCreate(true)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '10px 0',
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 8,
                        border: '1px dashed var(--border)',
                        background: 'transparent',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer',
                        marginBottom: 14,
                      }}
                    >
                      <Plus size={14} />
                      새 컬렉션 만들기
                    </button>
                  )}
                </AnimatePresence>

                <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 4, display: 'block' }}>
                  메모 (선택)
                </label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="이 저장소를 저장하는 이유, 사용처 등"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: 13,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </>
            )}
          </div>

          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !selectedId}
              style={{
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                border: 'none',
                background: saving || !selectedId ? 'var(--bg-secondary)' : 'var(--accent)',
                color: saving || !selectedId ? 'var(--text-tertiary)' : 'white',
                cursor: saving || !selectedId ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Bookmark size={13} />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    ),
    document.body
  );
}
