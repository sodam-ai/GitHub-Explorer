import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Eye, EyeOff, Download, Upload, Wifi, WifiOff, ExternalLink, Shield, Cpu, Database, Info, Palette, Languages } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { saveSetting, getSetting, isTauri } from '@/lib/tauri-bridge';
import { checkOllamaStatus, getOllamaModels, type OllamaModel } from '@/lib/ollama';
import { exportCollections, downloadJson } from '@/lib/export-import';
import { LOCALES, getLocale, setLocale } from '@/lib/i18n';
import { toast } from 'sonner';

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
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);

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

  useEffect(() => {
    checkOllamaStatus().then((ok) => {
      setOllamaOnline(ok);
      if (ok) getOllamaModels().then(setOllamaModels);
    });
  }, []);

  useEffect(() => {
    if (!githubToken) { setGithubUser(null); return; }
    fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setGithubUser(data?.login || null))
      .catch(() => setGithubUser(null));
  }, [githubToken]);

  async function handleSave() {
    if (githubToken) localStorage.setItem('github_token', githubToken);
    else localStorage.removeItem('github_token');
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    else localStorage.removeItem('openai_api_key');
    if (anthropicKey) localStorage.setItem('anthropic_api_key', anthropicKey);
    else localStorage.removeItem('anthropic_api_key');

    if (isTauri()) {
      if (githubToken) await saveSetting('github_token', githubToken);
      if (openaiKey) await saveSetting('openai_api_key', openaiKey);
      if (anthropicKey) await saveSetting('anthropic_api_key', anthropicKey);
    }

    setSaved(true);
    toast.success('설정이 저장되었습니다');
    setTimeout(() => setSaved(false), 2000);
  }

  function SecretInput({ label, value, onChange, show, onToggleShow, placeholder, hint }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; onToggleShow: () => void; placeholder: string; hint: string;
  }) {
    return (
      <div>
        <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="input-base pr-9 text-[13px] font-mono"
          />
          <button
            type="button"
            onClick={onToggleShow}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">{hint}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: 640, padding: '32px 32px 60px' }}>
        <button
          onClick={() => setCurrentPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 }}
        >
          <ArrowLeft size={15} />
          뒤로
        </button>

        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 32 }}>설정</h1>

        {/* GitHub */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-[var(--text-tertiary)]" />
            <h2 className="text-[13px] font-semibold">GitHub 계정</h2>
            {githubUser && (
              <span className="badge bg-green-500/10 text-green-600 ml-auto">
                <Check size={10} className="mr-1" />
                @{githubUser}
              </span>
            )}
          </div>
          <div className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg-card)] space-y-3">
            <SecretInput
              label="Personal Access Token"
              value={githubToken}
              onChange={setGithubToken}
              show={showGithub}
              onToggleShow={() => setShowGithub(!showGithub)}
              placeholder="ghp_..."
              hint="github.com/settings/tokens → Generate new token (classic) → repo 권한"
            />
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]">
              <Info size={10} />
              토큰이 있으면 API 한도가 시간당 60회 → 5,000회로 증가합니다
            </div>
          </div>
        </section>

        {/* AI */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={14} className="text-[var(--text-tertiary)]" />
            <h2 className="text-[13px] font-semibold">AI 제공자</h2>
          </div>
          <div className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg-card)] space-y-4">
            <SecretInput
              label="OpenAI API 키"
              value={openaiKey}
              onChange={setOpenaiKey}
              show={showOpenai}
              onToggleShow={() => setShowOpenai(!showOpenai)}
              placeholder="sk-..."
              hint="platform.openai.com/api-keys"
            />
            <div className="border-t border-[var(--border-subtle)]" />
            <SecretInput
              label="Anthropic API 키"
              value={anthropicKey}
              onChange={setAnthropicKey}
              show={showAnthropic}
              onToggleShow={() => setShowAnthropic(!showAnthropic)}
              placeholder="sk-ant-..."
              hint="console.anthropic.com"
            />
          </div>

          <button onClick={handleSave} className="btn btn-primary mt-3 text-[12px]">
            {saved ? <Check size={12} /> : null}
            {saved ? '저장됨' : '저장'}
          </button>
        </section>

        {/* Accent Color */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Palette size={14} className="text-[var(--text-tertiary)]" />
            <h2 className="text-[13px] font-semibold">테마 색상</h2>
          </div>
          <div className="flex gap-2">
            {(['blue', 'violet', 'emerald', 'rose', 'amber', 'cyan'] as const).map((color) => {
              const colors: Record<string, string> = {
                blue: '#3b82f6', violet: '#8b5cf6', emerald: '#10b981',
                rose: '#fb7185', amber: '#f59e0b', cyan: '#22d3ee',
              };
              const isActive = useAppStore.getState().accentColor === color;
              return (
                <button
                  key={color}
                  onClick={() => useAppStore.getState().setAccentColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    isActive ? 'border-[var(--text-primary)] scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ background: colors[color] }}
                  title={color}
                />
              );
            })}
          </div>
        </section>

        {/* Language */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Languages size={14} className="text-[var(--text-tertiary)]" />
            <h2 className="text-[13px] font-semibold">언어</h2>
          </div>
          <div className="flex gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc.key}
                onClick={() => { setLocale(loc.key); window.location.reload(); }}
                className={`btn text-[12px] ${
                  getLocale() === loc.key ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </section>

        {/* Ollama */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            {ollamaOnline ? (
              <Wifi size={14} className="text-green-500" />
            ) : (
              <WifiOff size={14} className="text-[var(--text-tertiary)]" />
            )}
            <h2 className="text-[13px] font-semibold">로컬 AI (Ollama)</h2>
            <span className={`badge ml-auto ${ollamaOnline ? 'bg-green-500/10 text-green-600' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'}`}>
              {ollamaOnline ? '연결됨' : '미감지'}
            </span>
          </div>
          <div className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg-card)]">
            {ollamaOnline && ollamaModels.length > 0 ? (
              <div className="space-y-1.5">
                {ollamaModels.map((m) => (
                  <div key={m.name} className="flex items-center justify-between px-3 py-2 bg-[var(--bg-secondary)] rounded-lg">
                    <span className="text-[12px] font-mono">{m.name}</span>
                    <span className="text-[11px] text-[var(--text-tertiary)]">{m.size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[12px] text-[var(--text-tertiary)]">
                  {ollamaOnline ? '설치된 모델이 없습니다' : 'Ollama가 실행되지 않고 있습니다'}
                </p>
                <a
                  href="https://ollama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-[11px] text-[var(--accent)] hover:underline"
                >
                  ollama.com에서 설치하기
                  <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Data */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Database size={14} className="text-[var(--text-tertiary)]" />
            <h2 className="text-[13px] font-semibold">데이터</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                const json = await exportCollections();
                downloadJson(json, `github-ai-explorer-backup-${new Date().toISOString().split('T')[0]}.json`);
                toast.success('컬렉션을 내보냈습니다');
              }}
              className="btn btn-outline text-[12px]"
            >
              <Download size={12} />
              컬렉션 내보내기
            </button>
            <button className="btn btn-outline text-[12px] opacity-40 cursor-not-allowed" title="준비 중">
              <Upload size={12} />
              가져오기
            </button>
          </div>
        </section>

        {/* About */}
        <section className="mb-8">
          <div className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg-card)] text-[12px] text-[var(--text-secondary)] space-y-1.5">
            <div className="flex justify-between">
              <span>버전</span>
              <span className="font-mono text-[var(--text-tertiary)]">0.3.0</span>
            </div>
            <div className="flex justify-between">
              <span>엔진</span>
              <span className="text-[var(--text-tertiary)]">Tauri 2.0 + React 19</span>
            </div>
            <div className="flex justify-between">
              <span>데이터</span>
              <span className="text-[var(--text-tertiary)]">SQLite (로컬 저장)</span>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
