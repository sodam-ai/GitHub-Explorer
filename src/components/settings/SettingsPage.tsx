import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Eye, EyeOff, Download, Upload, Wifi, WifiOff, ExternalLink, Shield, Cpu, Database, Info, Palette, Languages } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { saveSetting, getSetting, isTauri } from '@/lib/tauri-bridge';
import { checkOllamaStatus, getOllamaModels, type OllamaModel } from '@/lib/ollama';
import { exportCollections, downloadJson } from '@/lib/export-import';
import { LOCALES, getLocale, setLocale } from '@/lib/i18n';
import { toast } from 'sonner';

const sectionStyle: React.CSSProperties = { marginBottom: 36 };
const sectionHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 };
const sectionTitleStyle: React.CSSProperties = { fontSize: 14, fontWeight: 600 };
const cardStyle: React.CSSProperties = {
  padding: '18px 20px', borderRadius: 14,
  border: '1px solid var(--border)', background: 'var(--bg-card)',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 40px 10px 14px', fontSize: 13, fontFamily: 'monospace',
  borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-primary)',
  color: 'var(--text-primary)', outline: 'none',
};
const hintStyle: React.CSSProperties = { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 };

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
    fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${githubToken}` } })
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

  function SecretField({ label, value, onChange, show, onToggle, placeholder, hint }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; onToggle: () => void; placeholder: string; hint: string;
  }) {
    return (
      <div>
        <label style={labelStyle}>{label}</label>
        <div style={{ position: 'relative' }}>
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={onToggle}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <p style={hintStyle}>{hint}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: 640, padding: '32px 40px 80px' }}>

        <button
          onClick={() => setCurrentPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 28 }}
        >
          <ArrowLeft size={15} /> 뒤로
        </button>

        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 40 }}>설정</h1>

        {/* GitHub */}
        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <Shield size={16} style={{ color: 'var(--text-tertiary)' }} />
            <h2 style={sectionTitleStyle}>GitHub 계정</h2>
            {githubUser && (
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#16a34a', background: 'rgba(22,163,74,0.1)', padding: '3px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={10} /> @{githubUser}
              </span>
            )}
          </div>
          <div style={cardStyle}>
            <SecretField label="Personal Access Token" value={githubToken} onChange={setGithubToken} show={showGithub} onToggle={() => setShowGithub(!showGithub)} placeholder="ghp_..." hint="github.com/settings/tokens → Generate new token (classic) → repo 권한" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-tertiary)', marginTop: 10 }}>
              <Info size={11} /> 토큰이 있으면 API 한도가 시간당 60회 → 5,000회로 증가합니다
            </div>
          </div>
        </section>

        {/* AI */}
        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <Cpu size={16} style={{ color: 'var(--text-tertiary)' }} />
            <h2 style={sectionTitleStyle}>AI 제공자</h2>
          </div>
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SecretField label="OpenAI API 키" value={openaiKey} onChange={setOpenaiKey} show={showOpenai} onToggle={() => setShowOpenai(!showOpenai)} placeholder="sk-..." hint="platform.openai.com/api-keys" />
            <div style={{ height: 1, background: 'var(--border)' }} />
            <SecretField label="Anthropic API 키" value={anthropicKey} onChange={setAnthropicKey} show={showAnthropic} onToggle={() => setShowAnthropic(!showAnthropic)} placeholder="sk-ant-..." hint="console.anthropic.com" />
          </div>
          <button
            onClick={handleSave}
            style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, borderRadius: 10, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {saved && <Check size={13} />}
            {saved ? '저장됨' : '저장'}
          </button>
        </section>

        {/* Theme Color */}
        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <Palette size={16} style={{ color: 'var(--text-tertiary)' }} />
            <h2 style={sectionTitleStyle}>테마 색상</h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['blue', 'violet', 'emerald', 'rose', 'amber', 'cyan'] as const).map((color) => {
              const c: Record<string, string> = { blue: '#3b82f6', violet: '#8b5cf6', emerald: '#10b981', rose: '#fb7185', amber: '#f59e0b', cyan: '#22d3ee' };
              const isActive = useAppStore.getState().accentColor === color;
              return (
                <button
                  key={color}
                  onClick={() => useAppStore.getState().setAccentColor(color)}
                  style={{
                    width: 36, height: 36, borderRadius: 10, background: c[color], border: 'none', cursor: 'pointer',
                    outline: isActive ? '3px solid var(--text-primary)' : '3px solid transparent',
                    outlineOffset: 2, transition: 'all 0.12s', transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              );
            })}
          </div>
        </section>

        {/* Language */}
        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <Languages size={16} style={{ color: 'var(--text-tertiary)' }} />
            <h2 style={sectionTitleStyle}>언어</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {LOCALES.map((loc) => (
              <button
                key={loc.key}
                onClick={() => { setLocale(loc.key); window.location.reload(); }}
                style={{
                  padding: '8px 18px', fontSize: 13, fontWeight: 500, borderRadius: 10, cursor: 'pointer',
                  background: getLocale() === loc.key ? 'var(--accent)' : 'transparent',
                  color: getLocale() === loc.key ? 'white' : 'var(--text-secondary)',
                  border: getLocale() === loc.key ? 'none' : '1px solid var(--border)',
                }}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </section>

        {/* Ollama */}
        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            {ollamaOnline ? <Wifi size={16} style={{ color: '#16a34a' }} /> : <WifiOff size={16} style={{ color: 'var(--text-tertiary)' }} />}
            <h2 style={sectionTitleStyle}>로컬 AI (Ollama)</h2>
            <span style={{
              marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
              background: ollamaOnline ? 'rgba(22,163,74,0.1)' : 'var(--bg-secondary)',
              color: ollamaOnline ? '#16a34a' : 'var(--text-tertiary)',
            }}>
              {ollamaOnline ? '연결됨' : '미감지'}
            </span>
          </div>
          <div style={cardStyle}>
            {ollamaOnline && ollamaModels.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ollamaModels.map((m) => (
                  <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderRadius: 8, background: 'var(--bg-secondary)', fontSize: 12 }}>
                    <span style={{ fontFamily: 'monospace' }}>{m.name}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>{m.size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {ollamaOnline ? '설치된 모델이 없습니다' : 'Ollama가 실행되지 않고 있습니다'}
                </p>
                <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>
                  ollama.com에서 설치하기 <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Data */}
        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <Database size={16} style={{ color: 'var(--text-tertiary)' }} />
            <h2 style={sectionTitleStyle}>데이터</h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={async () => {
                const json = await exportCollections();
                downloadJson(json, `github-ai-explorer-backup-${new Date().toISOString().split('T')[0]}.json`);
                toast.success('컬렉션을 내보냈습니다');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 13, fontWeight: 500, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <Download size={14} /> 컬렉션 내보내기
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 13, fontWeight: 500, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'not-allowed', opacity: 0.4 }}>
              <Upload size={14} /> 가져오기
            </button>
          </div>
        </section>

        {/* About */}
        <section>
          <div style={{ ...cardStyle, fontSize: 13, color: 'var(--text-secondary)' }}>
            {[
              ['버전', '0.3.0'],
              ['엔진', 'Tauri 2.0 + React 19'],
              ['데이터', 'SQLite (로컬 저장)'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span>{k}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{v}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}
