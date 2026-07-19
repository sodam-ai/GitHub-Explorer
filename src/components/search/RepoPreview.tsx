import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  Star, GitFork, Eye, Calendar, X, AlertCircle, Tag, GitCommit,
  Scale, Activity, ExternalLink, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { throttledFetch } from '@/lib/github';
import { extractReadmeSummary, decodeBase64Utf8 } from '@/lib/summarize';
import type { Repository } from '@/types';

interface RepoPreviewProps {
  repo: Repository;
  onClose: () => void;
}

interface RepoDetail {
  forks: number;
  watchers: number;
  open_issues: number;
  updated_at: string;
  pushed_at: string;
  created_at: string;
  default_branch: string;
  license: string | null;
  homepage: string | null;
  subscribers_count: number;
}

interface ReleaseDetail {
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

export function RepoPreview({ repo, onClose }: RepoPreviewProps) {
  const [detail, setDetail] = useState<RepoDetail | null>(null);
  const [release, setRelease] = useState<ReleaseDetail | null>(null);
  const [readmeSummary, setReadmeSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [repoRes, releaseRes, readmeRes] = await Promise.allSettled([
          fetch(`https://api.github.com/repos/${repo.full_name}`).then((r) =>
            r.ok ? r.json() : null
          ),
          fetch(`https://api.github.com/repos/${repo.full_name}/releases/latest`).then((r) =>
            r.ok ? r.json() : null
          ),
          // README는 검색 결과 카드가 아닌 미리보기를 직접 연 경우에만 온디맨드로 1회
          // 가져온다 — 목록 전체에 걸었다면 P0에서 추가한 rate-limit 방지가 무의미해짐.
          throttledFetch(`https://api.github.com/repos/${repo.full_name}/readme`).then((r) =>
            r.ok ? r.json() : null
          ),
        ]);
        if (!active) return;

        const repoData = repoRes.status === 'fulfilled' ? repoRes.value : null;
        const releaseData = releaseRes.status === 'fulfilled' ? releaseRes.value : null;
        const readmeData = readmeRes.status === 'fulfilled' ? readmeRes.value : null;

        if (readmeData?.content) {
          try {
            const markdown = decodeBase64Utf8(readmeData.content);
            setReadmeSummary(extractReadmeSummary(markdown));
          } catch {
            setReadmeSummary(null);
          }
        } else {
          setReadmeSummary(null);
        }

        if (repoData) {
          setDetail({
            forks: repoData.forks_count || 0,
            watchers: repoData.watchers_count || 0,
            open_issues: repoData.open_issues_count || 0,
            updated_at: repoData.updated_at || '',
            pushed_at: repoData.pushed_at || '',
            created_at: repoData.created_at || '',
            default_branch: repoData.default_branch || 'main',
            license: repoData.license?.spdx_id || null,
            homepage: repoData.homepage || null,
            subscribers_count: repoData.subscribers_count || 0,
          });
        }

        if (releaseData && releaseData.tag_name) {
          setRelease({
            tag_name: releaseData.tag_name,
            name: releaseData.name,
            published_at: releaseData.published_at,
            html_url: releaseData.html_url,
          });
        }
      } catch (e) {
        if (active) {
          setDetail(null);
          console.error('Failed to load repo preview detail:', e);
          toast.error('저장소 상세 정보를 불러오지 못했습니다', {
            description: '인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요',
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [repo.full_name]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return createPortal(
    (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 520,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-lg, 0 20px 40px rgba(0,0,0,0.3))',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '85vh',
          }}
        >
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {repo.owner_avatar && (
                <img
                  src={repo.owner_avatar}
                  alt=""
                  style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
                    textDecoration: 'none', display: 'block',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                  className="hover:text-[var(--accent)]"
                >
                  {repo.full_name}
                </a>
                {repo.description && (
                  <p style={{
                    fontSize: 12, color: 'var(--text-secondary)', marginTop: 2,
                    lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {repo.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: 6, background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-tertiary)',
                borderRadius: 6, flexShrink: 0,
              }}
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
              marginBottom: 14,
            }}>
              <StatCard icon={<Star size={14} style={{ color: '#f59e0b' }} />} label="별" value={formatNumber(repo.stars)} />
              <StatCard
                icon={<GitFork size={14} style={{ color: 'var(--text-tertiary)' }} />}
                label="포크"
                value={loading ? '...' : detail ? formatNumber(detail.forks) : '—'}
              />
              <StatCard
                icon={<AlertCircle size={14} style={{ color: '#22c55e' }} />}
                label="열린 이슈"
                value={loading ? '...' : detail ? formatNumber(detail.open_issues) : '—'}
              />
              <StatCard
                icon={<Eye size={14} style={{ color: 'var(--text-tertiary)' }} />}
                label="감시 중"
                value={loading ? '...' : detail ? formatNumber(detail.subscribers_count) : '—'}
              />
            </div>

            {readmeSummary && (
              <div style={{
                padding: '12px 14px', borderRadius: 10,
                background: 'var(--accent-muted)', marginBottom: 14,
                fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-secondary)',
              }}>
                {readmeSummary}
              </div>
            )}

            {detail && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                padding: '12px 14px', borderRadius: 10,
                background: 'var(--bg-secondary)', marginBottom: 14,
              }}>
                <InfoRow
                  icon={<Activity size={12} />}
                  label="최근 푸시"
                  value={detail.pushed_at ? timeAgo(detail.pushed_at) : '정보 없음'}
                />
                <InfoRow
                  icon={<Calendar size={12} />}
                  label="생성일"
                  value={detail.created_at ? new Date(detail.created_at).toLocaleDateString('ko-KR') : '정보 없음'}
                />
                <InfoRow
                  icon={<GitCommit size={12} />}
                  label="기본 브랜치"
                  value={detail.default_branch}
                />
                {detail.license && (
                  <InfoRow
                    icon={<Scale size={12} />}
                    label="라이선스"
                    value={detail.license}
                  />
                )}
                {repo.language && (
                  <InfoRow
                    icon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />}
                    label="주 언어"
                    value={repo.language}
                  />
                )}
              </div>
            )}

            {release && (
              <a
                href={release.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--accent-muted)',
                  border: '1px solid var(--accent)',
                  textDecoration: 'none', color: 'inherit',
                  marginBottom: 14,
                }}
              >
                <Tag size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                    최신 릴리스
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--accent)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {release.tag_name}{release.name && release.name !== release.tag_name ? ` · ${release.name}` : ''}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} />
                    {release.published_at ? timeAgo(release.published_at) : ''}
                  </div>
                </div>
                <ExternalLink size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              </a>
            )}

            {detail?.homepage && (
              <a
                href={detail.homepage.startsWith('http') ? detail.homepage : `https://${detail.homepage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
                  border: '1px solid var(--border)',
                  textDecoration: 'none', color: 'var(--text-secondary)',
                  marginBottom: 14, fontSize: 12,
                }}
              >
                <ExternalLink size={13} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {detail.homepage}
                </span>
              </a>
            )}

            {repo.topics.length > 0 && (
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 6 }}>
                  토픽
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {repo.topics.slice(0, 10).map((t) => (
                    <span key={t} style={{
                      padding: '4px 10px', fontSize: 11, fontWeight: 500,
                      borderRadius: 99,
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '8px 18px', fontSize: 13, fontWeight: 600,
                borderRadius: 8,
                background: 'var(--accent)', color: 'white',
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <ExternalLink size={13} />
              GitHub에서 자세히 보기
            </a>
          </div>
        </motion.div>
      </motion.div>
    ),
    document.body
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 10,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
    }}>
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
      <span style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ color: 'var(--text-tertiary)', flexShrink: 0, minWidth: 70 }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
