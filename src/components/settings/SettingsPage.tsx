import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { saveSetting, getSetting, isTauri } from '@/lib/tauri-bridge';

export function SettingsPage() {
  const { setCurrentPage } = useAppStore();
  const [githubToken, setGithubToken] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [showGithub, setShowGithub] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [saved, setSaved] = useState(false);
  const [githubUser, setGithubUser] = useState<string | null>(null);

  useEffect(() => {
    async function loadKeys() {
      if (isTauri()) {
        const gh = await getSetting('github_token');
        const oai = await getSetting('openai_api_key');
        const ant = await getSetting('anthropic_api_key');
        if (gh) setGithubToken(gh);
        if (oai) setOpenaiKey(oai);
        if (ant) setAnthropicKey(ant);
      } else {
        setGithubToken(localStorage.getItem('github_token') || '');
        setOpenaiKey(localStorage.getItem('openai_api_key') || '');
        setAnthropicKey(localStorage.getItem('anthropic_api_key') || '');
      }
    }
    loadKeys();
  }, []);

  // GitHub 토큰 검증
  useEffect(() => {
    if (!githubToken) {
      setGithubUser(null);
      return;
    }
    fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setGithubUser(data?.login || null))
      .catch(() => setGithubUser(null));
  }, [githubToken]);

  async function handleSave() {
    // localStorage (항상)
    if (githubToken) localStorage.setItem('github_token', githubToken);
    else localStorage.removeItem('github_token');
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    else localStorage.removeItem('openai_api_key');
    if (anthropicKey) localStorage.setItem('anthropic_api_key', anthropicKey);
    else localStorage.removeItem('anthropic_api_key');

    // SQLite DB (Tauri 환경)
    if (isTauri()) {
      if (githubToken) await saveSetting('github_token', githubToken);
      if (openaiKey) await saveSetting('openai_api_key', openaiKey);
      if (anthropicKey) await saveSetting('anthropic_api_key', anthropicKey);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
      <button
        onClick={() => setCurrentPage('home')}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        뒤로
      </button>

      <h1 className="text-2xl font-bold mb-6">설정</h1>

      {/* GitHub 계정 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">GitHub 계정</h2>
        <div className="p-4 border border-[var(--border)] rounded-xl">
          <label className="block text-sm font-medium mb-2">
            GitHub Personal Access Token
          </label>
          {githubUser && (
            <div className="mb-2 flex items-center gap-2 text-sm text-green-500">
              <Check size={14} />
              연결됨: @{githubUser}
            </div>
          )}
          <div className="relative">
            <input
              type={showGithub ? 'text' : 'password'}
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full px-3 py-2 pr-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--accent)]"
            />
            <button
              type="button"
              onClick={() => setShowGithub(!showGithub)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            >
              {showGithub ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            github.com/settings/tokens → "Generate new token (classic)" → repo 권한 선택
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            토큰이 있으면 API 호출 한도가 시간당 60회 → 5,000회로 증가합니다
          </p>
        </div>
      </section>

      {/* AI 제공자 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">AI 제공자</h2>

        <div className="space-y-4">
          <div className="p-4 border border-[var(--border)] rounded-xl">
            <label className="block text-sm font-medium mb-2">OpenAI API 키</label>
            <div className="relative">
              <input
                type={showOpenai ? 'text' : 'password'}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 pr-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={() => setShowOpenai(!showOpenai)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              >
                {showOpenai ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              platform.openai.com/api-keys 에서 발급
            </p>
          </div>

          <div className="p-4 border border-[var(--border)] rounded-xl">
            <label className="block text-sm font-medium mb-2">Anthropic API 키</label>
            <div className="relative">
              <input
                type={showAnthropic ? 'text' : 'password'}
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 pr-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={() => setShowAnthropic(!showAnthropic)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              >
                {showAnthropic ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              console.anthropic.com 에서 발급
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
        >
          {saved ? <Check size={14} /> : null}
          {saved ? '저장됨!' : '저장'}
        </button>
      </section>

      {/* 앱 정보 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">앱 정보</h2>
        <div className="p-4 border border-[var(--border)] rounded-xl text-sm space-y-2">
          <p>
            <span className="text-[var(--text-secondary)]">버전:</span> 0.1.0 (Phase 1 MVP)
          </p>
          <p>
            <span className="text-[var(--text-secondary)]">기술 스택:</span> Tauri 2.0 + React +
            TypeScript
          </p>
        </div>
      </section>
    </div>
  );
}
