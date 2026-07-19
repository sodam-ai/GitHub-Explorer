import { X, Star, Activity, Code, GitFork, Scale, Save } from 'lucide-react';
import type { Repository } from '@/types';
import { calculateHealthScore, getHealthColor } from '@/lib/health-score';
import { useCompareStore } from '@/stores/compare-store';
import { toast } from 'sonner';

interface RepoCompareProps {
  repos: Repository[];
  onClose: () => void;
}

export function RepoCompare({ repos, onClose }: RepoCompareProps) {
  const { addRecord } = useCompareStore();

  function handleSaveComparison() {
    addRecord(repos);
    toast.success('비교 기록이 저장되었습니다');
  }
  if (repos.length < 2) return null;

  const healthScores = repos.map((r) => calculateHealthScore(r));

  const rows: { label: string; icon: React.ReactNode; values: (string | React.ReactNode)[] }[] = [
    {
      label: '스타',
      icon: <Star size={14} className="text-yellow-500" />,
      values: repos.map((r) => r.stars >= 1000 ? `${(r.stars / 1000).toFixed(1)}k` : String(r.stars)),
    },
    {
      label: '언어',
      icon: <Code size={14} />,
      values: repos.map((r) => r.language || '-'),
    },
    {
      label: '건강도',
      icon: <Activity size={14} />,
      values: healthScores.map((h) => (
        <span style={{ color: getHealthColor(h.total) }} className="font-medium">
          {h.total}/100 ({h.grade})
        </span>
      )),
    },
    {
      label: '토픽',
      icon: <GitFork size={14} />,
      values: repos.map((r) => r.topics.slice(0, 3).join(', ') || '-'),
    },
    {
      label: '설명',
      icon: <Scale size={14} />,
      values: repos.map((r) => r.description?.slice(0, 60) || '-'),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl mx-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">저장소 비교</h2>
          <button
            onClick={handleSaveComparison}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px',
              fontSize: 11, fontWeight: 500, borderRadius: 6,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}
          >
            <Save size={11} /> 기록 저장
          </button>
          <button onClick={onClose} className="p-1 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors" aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">항목</th>
                {repos.map((r) => (
                  <th key={r.id} className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2">
                      {r.owner_avatar && <img src={r.owner_avatar} alt="" className="w-5 h-5 rounded-full" />}
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] hover:underline">
                        {r.full_name}
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      {row.icon}
                      {row.label}
                    </div>
                  </td>
                  {row.values.map((val, i) => (
                    <td key={i} className="px-6 py-3 text-sm">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
