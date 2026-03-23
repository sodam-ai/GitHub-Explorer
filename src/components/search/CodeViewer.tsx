import { useEffect, useRef } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-css';
import type { CodeResult } from '@/types';

interface CodeViewerProps {
  code: CodeResult;
}

function getLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    py: 'python', rs: 'rust', go: 'go', java: 'java', json: 'json',
    sh: 'bash', yml: 'yaml', yaml: 'yaml', css: 'css', md: 'markdown',
  };
  return map[ext] || 'plaintext';
}

export function CodeViewer({ code }: CodeViewerProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const language = getLanguage(code.path);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code.content]);

  function handleCopy() {
    navigator.clipboard.writeText(code.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border border-[var(--border)] rounded-xl bg-[var(--bg-card)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-mono">
            {language}
          </span>
          <a
            href={code.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] truncate transition-colors"
          >
            {code.repository}/{code.path}
          </a>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-[var(--bg-primary)] transition-colors"
            title="복사"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-[var(--text-secondary)]" />}
          </button>
          <a
            href={code.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-[var(--bg-primary)] transition-colors"
            title="GitHub에서 보기"
          >
            <ExternalLink size={14} className="text-[var(--text-secondary)]" />
          </a>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed m-0">
        <code ref={codeRef} className={`language-${language}`}>
          {code.content}
        </code>
      </pre>
    </div>
  );
}
