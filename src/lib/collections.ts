import { invoke } from '@tauri-apps/api/core';
import { isTauri } from './tauri-bridge';

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
