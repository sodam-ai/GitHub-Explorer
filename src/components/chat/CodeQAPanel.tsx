import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ArrowLeft, Code, User, Bot } from 'lucide-react';
import type { Repository } from '@/types';
import { askCodeQuestion } from '@/lib/code-qa';
import { getSetting, isTauri } from '@/lib/tauri-bridge';

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

export function CodeQAPanel({ repo, onClose }: CodeQAPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let apiKey = '';
      if (isTauri()) {
        apiKey = (await getSetting('openai_api_key')) || '';
      }
      if (!apiKey) {
        apiKey = localStorage.getItem('openai_api_key') || '';
      }

      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const result = await askCodeQuestion(trimmed, repo, apiKey, history);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.answer,
        codeRefs: result.codeRefs,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: '오류가 발생했습니다.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <button onClick={onClose} className="p-1 hover:bg-[var(--bg-primary)] rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </button>
        <Code size={18} className="text-[var(--accent)]" />
        <div>
          <h2 className="text-sm font-semibold">{repo.full_name}</h2>
          <p className="text-xs text-[var(--text-secondary)]">코드 Q&A</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
            <Code size={48} className="mb-4 opacity-20" />
            <p className="text-lg mb-2">코드에 대해 질문하세요</p>
            <div className="space-y-1 text-sm">
              <p>"이 프로젝트의 전체 아키텍처를 설명해줘"</p>
              <p>"인증 로직은 어떻게 구현되어 있어?"</p>
              <p>"메인 엔트리포인트는 어디야?"</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-[var(--accent)]" />
              </div>
            )}
            <div
              className={`max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border)]'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.codeRefs && msg.codeRefs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.codeRefs.map((ref) => (
                    <span key={ref} className="px-1.5 py-0.5 text-xs rounded bg-[var(--bg-primary)] font-mono">
                      {ref}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[var(--text-secondary)]/10 flex items-center justify-center shrink-0">
                <User size={14} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-[var(--accent)]" />
            </div>
            <div className="px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="코드에 대해 질문하세요..."
            className="flex-1 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
