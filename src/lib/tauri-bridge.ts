import { invoke } from '@tauri-apps/api/core';
import type { SearchHistory } from '@/types';

// --- Search History ---

export async function saveSearchHistory(entry: SearchHistory): Promise<void> {
  try {
    await invoke('save_search_history', {
      entry: {
        id: entry.id,
        query: entry.query,
        result_count: entry.result_count,
        filters: entry.filters ? JSON.stringify(entry.filters) : null,
        searched_at: entry.searched_at,
      },
    });
  } catch (e) {
    console.error('Failed to save search history to DB:', e);
  }
}

export async function getSearchHistory(limit = 50): Promise<SearchHistory[]> {
  try {
    const entries = await invoke<
      Array<{
        id: string;
        query: string;
        result_count: number;
        filters: string | null;
        searched_at: string;
      }>
    >('get_search_history', { limit });
    return entries.map((e) => ({
      ...e,
      filters: e.filters ? JSON.parse(e.filters) : null,
    }));
  } catch (e) {
    console.error('Failed to get search history from DB:', e);
    return [];
  }
}

export async function clearSearchHistoryDB(): Promise<void> {
  try {
    await invoke('clear_search_history');
  } catch (e) {
    console.error('Failed to clear search history in DB:', e);
  }
}

// --- Secrets (API 키·토큰 전용) ---
// OS 키체인에만 저장한다. localStorage 폴백은 의도적으로 두지 않음 —
// 평문 저장이 CRITICAL 보안 위험이었기 때문(감사 2026-07-20).
// Tauri 밖(순수 브라우저 dev 모드)에서는 키체인에 접근할 수 없으므로 저장이 무시된다.

export async function saveSecret(key: string, value: string): Promise<void> {
  if (!isTauri()) return;
  try {
    await invoke('save_secret', { key, value });
  } catch (e) {
    console.error(`Failed to save secret '${key}' to OS keychain:`, e);
  }
}

export async function getSecret(key: string): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    return await invoke<string | null>('get_secret', { key });
  } catch (e) {
    console.error(`Failed to read secret '${key}' from OS keychain:`, e);
    return null;
  }
}

export async function deleteSecret(key: string): Promise<void> {
  if (!isTauri()) return;
  try {
    await invoke('delete_secret', { key });
  } catch (e) {
    console.error(`Failed to delete secret '${key}' from OS keychain:`, e);
  }
}

// --- Conversations (AI 코드 Q&A 기록) ---
// Rust 커맨드(create_conversation/get_conversations/save_message/get_messages)는
// 이미 존재했으나 프론트엔드에서 호출하는 곳이 없어 기능이 배선되지 않은 상태였음
// (감사 2026-07-20, Phase2 #7). CodeQAPanel에서 실제로 쓰도록 여기서 연결.

export interface ConversationEntry {
  id: string;
  title: string;
  repository_id: string | null;
  created_at: string;
}

export interface MessageEntry {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  code_refs: string | null;
  created_at: string;
}

export async function createConversation(entry: ConversationEntry): Promise<void> {
  if (!isTauri()) return;
  try {
    await invoke('create_conversation', { entry });
  } catch (e) {
    console.error('Failed to create conversation:', e);
  }
}

// 저장소별 최근 대화 1건을 찾는다. 서버 측 필터가 없어 전체를 가져와 클라이언트에서
// 거르는 방식 — 개인용 앱 규모(대화 수가 많지 않음)에서는 충분히 가벼움.
export async function findConversationByRepo(repositoryId: string): Promise<ConversationEntry | null> {
  if (!isTauri()) return null;
  try {
    const all = await invoke<ConversationEntry[]>('get_conversations', { limit: 500 });
    return all.find((c) => c.repository_id === repositoryId) || null;
  } catch (e) {
    console.error('Failed to get conversations:', e);
    return null;
  }
}

export async function saveMessage(msg: MessageEntry): Promise<void> {
  if (!isTauri()) return;
  try {
    await invoke('save_message', { msg });
  } catch (e) {
    console.error('Failed to save message:', e);
  }
}

export async function getMessages(conversationId: string): Promise<MessageEntry[]> {
  if (!isTauri()) return [];
  try {
    return await invoke<MessageEntry[]>('get_messages', { conversationId });
  } catch (e) {
    console.error('Failed to get messages:', e);
    return [];
  }
}

// --- Utility ---

export function isTauri(): boolean {
  return '__TAURI_INTERNALS__' in window;
}
