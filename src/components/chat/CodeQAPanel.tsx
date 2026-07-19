import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Code, User, Bot, X, Sparkles } from 'lucide-react';
import type { Repository } from '@/types';
import { askCodeQuestion } from '@/lib/code-qa';
import { getSecret, createConversation, findConversationByRepo, saveMessage, getMessages } from '@/lib/tauri-bridge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeRefs?: string[];
}

interface CodeQAPanelProps {
  repo: Repository;
  onClose: () => void;
}

const EXAMPLES = [
  '이 프로젝트의 전체 아키텍처를 설명해줘',
  '메인 엔트리포인트는 어디야?',
  '핵심 API나 훅은 뭐가 있어?',
];

export function CodeQAPanel({ repo, onClose }: CodeQAPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // 이 저장소에 대한 기존 대화 기록을 불러온다 (Tauri 밖에서는 항상 빈 값)
  useEffect(() => {
    async function loadHistory() {
      const existing = await findConversationByRepo(repo.id);
      if (!existing) return;
      setConversationId(existing.id);
      const saved = await getMessages(existing.id);
      setMessages(
        saved.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          codeRefs: m.code_refs ? (JSON.parse(m.code_refs) as string[]) : undefined,
        }))
      );
    }
    loadHistory();
  }, [repo.id]);

  async function handleSend(text?: string) {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = (await getSecret('openai_api_key')) || '';

      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const result = await askCodeQuestion(trimmed, repo, apiKey, history);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.answer,
        codeRefs: result.codeRefs,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // 대화 기록 영구 저장 (첫 메시지면 대화 세션을 새로 만듦)
      let convId = conversationId;
      const now = new Date().toISOString();
      if (!convId) {
        convId = crypto.randomUUID();
        setConversationId(convId);
        await createConversation({
          id: convId,
          title: `${repo.full_name} 코드 분석`,
          repository_id: repo.id,
          created_at: now,
        });
      }
      await saveMessage({
        id: userMsg.id,
        conversation_id: convId,
        role: 'user',
        content: userMsg.content,
        code_refs: null,
        created_at: now,
      });
      await saveMessage({
        id: assistantMsg.id,
        conversation_id: convId,
        role: 'assistant',
        content: assistantMsg.content,
        code_refs: assistantMsg.codeRefs?.length ? JSON.stringify(assistantMsg.codeRefs) : null,
        created_at: new Date().toISOString(),
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: '오류가 발생했습니다. 다시 시도해주세요.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-primary)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
        <div className="flex items-center gap-2.5">
          <button onClick={onClose} className="btn btn-ghost p-1.5">
            <ArrowLeft size={15} />
          </button>
          <div className="divider" />
          <Code size={14} className="text-[var(--accent)]" />
          <div>
            <span className="text-[12px] font-medium">
              <span className="text-[var(--text-tertiary)]">{repo.full_name.split('/')[0]}/</span>
              {repo.full_name.split('/')[1]}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost p-1.5">
          <X size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center pt-12"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center mb-4">
                <Sparkles size={20} className="text-[var(--accent)]" />
              </div>
              <h2 className="text-[15px] font-semibold mb-1">코드에 대해 질문하세요</h2>
              <p className="text-[12px] text-[var(--text-tertiary)] mb-6">
                {repo.full_name}의 코드를 AI가 분석해서 답변합니다
              </p>
              <div className="space-y-2 w-full max-w-sm">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleSend(ex)}
                    className="w-full text-left px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-[12px] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-[var(--accent-muted)] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={12} className="text-[var(--accent)]" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-xl text-[13px] leading-[1.65] ${
                    msg.role === 'user'
                      ? 'bg-[var(--accent)] text-white rounded-br-sm'
                      : 'bg-[var(--bg-card)] border border-[var(--border)] rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.codeRefs && msg.codeRefs.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.codeRefs.map((ref) => (
                        <span key={ref} className="px-1.5 py-0.5 text-[10px] rounded bg-black/10 font-mono">
                          {ref}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 mt-0.5">
                    <User size={12} className="text-[var(--text-tertiary)]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2.5"
            >
              <div className="w-6 h-6 rounded-md bg-[var(--accent-muted)] flex items-center justify-center shrink-0">
                <Bot size={12} className="text-[var(--accent)]" />
              </div>
              <div className="px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="max-w-2xl mx-auto flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="코드에 대해 질문하세요..."
            className="input-base text-[13px]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn btn-primary px-3"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
