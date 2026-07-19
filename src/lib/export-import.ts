import { getCollections, getCollectionItems, createCollection, restoreCollectionItem, type Collection, type CollectionItem } from './collections';

export interface ExportData {
  version: '1.0';
  exported_at: string;
  collections: Array<Collection & { items: CollectionItem[] }>;
}

export async function exportCollections(): Promise<string> {
  const collections = await getCollections();
  const collectionsWithItems = await Promise.all(
    collections.map(async (col) => {
      const items = await getCollectionItems(col.id);
      return { ...col, items };
    })
  );

  const data: ExportData = {
    version: '1.0',
    exported_at: new Date().toISOString(),
    collections: collectionsWithItems,
  };

  return JSON.stringify(data, null, 2);
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateImportData(json: string): ExportData | null {
  try {
    const data = JSON.parse(json);
    if (data.version !== '1.0' || !Array.isArray(data.collections)) return null;
    return data as ExportData;
  } catch {
    return null;
  }
}

export interface ImportResult {
  collections: number;
  items: number;
  skipped: number;
}

/**
 * 항상 새 컬렉션으로 추가(병합 없음). 이름 등 필수 필드가 비어있는
 * 손상된 항목은 건너뛰고 나머지는 계속 진행한다.
 */
export async function importCollections(data: ExportData): Promise<ImportResult> {
  let itemCount = 0;
  let skipped = 0;

  for (const col of data.collections) {
    if (!col.name || !Array.isArray(col.items)) {
      skipped++;
      continue;
    }

    const newCollection = await createCollection(col.name, col.description || undefined, col.color);
    for (const item of col.items) {
      if (!item.repository_id) {
        skipped++;
        continue;
      }
      await restoreCollectionItem(newCollection.id, item);
      itemCount++;
    }
  }

  return { collections: data.collections.length - skipped, items: itemCount, skipped };
}
