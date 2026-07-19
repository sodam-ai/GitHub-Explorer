import { invoke } from '@tauri-apps/api/core';
import { isTauri } from './tauri-bridge';
import type { Repository } from '@/types';

const CACHE_TTL_DAYS = 7;

export async function cacheRepository(repo: Repository): Promise<void> {
  if (!isTauri()) return;
  try {
    await invoke('save_setting', {
      key: `repo_cache:${repo.id}`,
      value: JSON.stringify(repo),
    });
  } catch (e) {
    console.error('Failed to cache repository:', e);
  }
}

export async function cacheRepositories(repos: Repository[]): Promise<void> {
  for (const repo of repos) {
    await cacheRepository(repo);
  }
}

export async function getCachedRepositories(query: string): Promise<Repository[]> {
  if (!isTauri()) return [];
  try {
    const allSettings = await invoke<Array<[string, string]>>('get_all_settings');
    const cached: Repository[] = [];
    const queryLower = query.toLowerCase();

    for (const [key, value] of allSettings) {
      if (!key.startsWith('repo_cache:')) continue;
      try {
        const repo: Repository = JSON.parse(value);
        const searchable = `${repo.full_name} ${repo.description || ''} ${repo.topics.join(' ')} ${repo.language || ''}`.toLowerCase();
        if (searchable.includes(queryLower)) {
          cached.push(repo);
        }
      } catch {
        // skip invalid
      }
    }

    // 최신 캐시(7일 이내)를 우선 표시. 오프라인 모드는 유일한 데이터 소스이므로
    // 만료됐다고 결과 자체를 숨기지는 않고, 신선도 기준으로 정렬만 한다.
    return cached
      .sort((a, b) => {
        const aExpired = isCacheExpired(a.last_synced);
        const bExpired = isCacheExpired(b.last_synced);
        if (aExpired !== bExpired) return aExpired ? 1 : -1;
        return b.stars - a.stars;
      })
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function isOnline(): Promise<boolean> {
  try {
    const res = await fetch('https://api.github.com', {
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function isCacheExpired(lastSynced: string): boolean {
  const synced = new Date(lastSynced).getTime();
  const now = Date.now();
  const diffDays = (now - synced) / (1000 * 60 * 60 * 24);
  return diffDays > CACHE_TTL_DAYS;
}
