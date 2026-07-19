import { invoke } from '@tauri-apps/api/core';
import { isTauri } from './tauri-bridge';
import type { Repository } from '@/types';

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  created_at: string;
  item_count?: number;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  repository_id: string;
  memo: string | null;
  added_at: string;
  // 저장 시점 스냅샷 (옛 레코드는 null)
  full_name?: string | null;
  description?: string | null;
  stars?: number | null;
  language?: string | null;
  owner_avatar?: string | null;
  url?: string | null;
  topics?: string | null;
}

export async function createCollection(name: string, description?: string, color?: string): Promise<Collection> {
  const entry: Collection = {
    id: crypto.randomUUID(),
    name,
    description: description || null,
    color: color || '#3b82f6',
    icon: 'folder',
    created_at: new Date().toISOString(),
  };
  if (isTauri()) {
    await invoke('create_collection', { entry });
  }
  return entry;
}

export async function getCollections(): Promise<Collection[]> {
  if (isTauri()) {
    return invoke<Collection[]>('get_collections');
  }
  return [];
}

export async function deleteCollection(id: string): Promise<void> {
  if (isTauri()) {
    await invoke('delete_collection', { id });
  }
}

export async function addToCollection(collectionId: string, repositoryId: string, memo?: string): Promise<CollectionItem> {
  const item: CollectionItem = {
    id: crypto.randomUUID(),
    collection_id: collectionId,
    repository_id: repositoryId,
    memo: memo || null,
    added_at: new Date().toISOString(),
    full_name: null,
    description: null,
    stars: null,
    language: null,
    owner_avatar: null,
    url: null,
    topics: null,
  };
  if (isTauri()) {
    await invoke('add_to_collection', { item });
  }
  return item;
}

/**
 * 저장소 전체 객체를 받아 메타 스냅샷과 함께 컬렉션에 저장.
 * 컬렉션 페이지에서 오프라인에서도 저장소 카드를 완전히 표시할 수 있게 함.
 */
export async function addRepositoryToCollection(
  collectionId: string,
  repository: Repository,
  memo?: string
): Promise<CollectionItem> {
  const item: CollectionItem = {
    id: crypto.randomUUID(),
    collection_id: collectionId,
    repository_id: repository.id,
    memo: memo || null,
    added_at: new Date().toISOString(),
    full_name: repository.full_name,
    description: repository.description,
    stars: repository.stars,
    language: repository.language,
    owner_avatar: repository.owner_avatar,
    url: repository.url,
    topics: JSON.stringify(repository.topics || []),
  };
  if (isTauri()) {
    await invoke('add_to_collection', { item });
  }
  return item;
}

export async function removeFromCollection(id: string): Promise<void> {
  if (isTauri()) {
    await invoke('remove_from_collection', { id });
  }
}

export async function getCollectionItems(collectionId: string): Promise<CollectionItem[]> {
  if (isTauri()) {
    return invoke<CollectionItem[]>('get_collection_items', { collectionId });
  }
  return [];
}
