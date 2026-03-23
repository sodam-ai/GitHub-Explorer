import { getCollections, getCollectionItems, type Collection, type CollectionItem } from './collections';

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
