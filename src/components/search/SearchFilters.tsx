import { useState, useRef, useEffect } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';

export interface SearchFilterValues {
  language: string;
  minStars: number;
  sortBy: 'stars' | 'updated' | 'relevance' | 'forks';
  owner: string;
  license: string;
  updatedAfter: string;
  minForks: number;
  excludeArchived: boolean;
}

export const DEFAULT_FILTERS: SearchFilterValues = {
  language: '', minStars: 0, sortBy: 'relevance', owner: '',
  license: '', updatedAfter: '', minForks: 0, excludeArchived: false,
};

interface SearchFiltersProps {
  filters: SearchFilterValues;
  onFiltersChange: (filters: SearchFilterValues) => void;
  onApply?: () => void;
  inline?: boolean;
}

const LANGUAGES = [
  'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java',
  'C++', 'C#', 'C', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart',
  'Shell', 'Lua', 'R', 'Scala', 'Elixir', 'Haskell',
];

const LICENSES = [
  { value: '', label: '전체' },
  { value: 'mit', label: 'MIT' },
  { value: 'apache-2.0', label: 'Apache 2.0' },
  { value: 'gpl-3.0', label: 'GPL 3.0' },
  { value: 'bsd-3-clause', label: 'BSD 3' },
  { value: 'bsd-2-clause', label: 'BSD 2' },
  { value: 'mpl-2.0', label: 'MPL 2.0' },
  { value: 'unlicense', label: 'Unlicense' },
];

const DATE_OPTIONS = [
  { value: '', label: '전체' },
  { value: '7', label: '최근 1주' },
  { value: '30', label: '최근 1달' },
  { value: '90', label: '최근 3달' },
  { value: '365', label: '최근 1년' },
];

const STAR_OPTIONS = [
  { label: '전체', value: 0 },
  { label: '10+', value: 10 },
  { label: '100+', value: 100 },
  { label: '500+', value: 500 },
  { label: '1K+', value: 1000 },
  { label: '5K+', value: 5000 },
  { label: '10K+', value: 10000 },
];

const FORK_OPTIONS = [
  { label: '전체', value: 0 },
  { label: '10+', value: 10 },
  { label: '50+', value: 50 },
  { label: '100+', value: 100 },
  { label: '500+', value: 500 },
];

const PRESETS = [
  { label: '인기 + 최신', filters: { ...DEFAULT_FILTERS, minStars: 1000, sortBy: 'updated' as const, updatedAfter: '90' } },
  { label: 'MIT 라이선스', filters: { ...DEFAULT_FILTERS, license: 'mit', minStars: 100 } },
  { label: '소규모 프로젝트', filters: { ...DEFAULT_FILTERS, minStars: 10, sortBy: 'updated' as const, updatedAfter: '30' } },
];

export function SearchFilters({ filters, onFiltersChange, onApply, inline = false }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const filtersOnOpenRef = useRef(JSON.stringify(filters));

  const activeCount = [
    filters.language, filters.minStars > 0, filters.sortBy !== 'relevance',
    filters.owner, filters.license, filters.updatedAfter,
    filters.minForks > 0, filters.excludeArchived,
  ].filter(Boolean).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // 필터가 실제로 변경된 경우에만 재검색
        if (JSON.stringify(filters) !== filtersOnOpenRef.current) {
          onApply?.();
        }
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onApply]);

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', fontSize: 12, borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', outline: 'none',
  };
  const labelSt: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em' };

  const filterContent = (
    <>
      {/* Presets */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelSt}>프리셋</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => onFiltersChange(p.filters)}
              style={{
                padding: '6px 12px', fontSize: 11, fontWeight: 500, borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
          {activeCount > 0 && (
            <button
              onClick={() => onFiltersChange(DEFAULT_FILTERS)}
              style={{
                padding: '6px 12px', fontSize: 11, fontWeight: 500, borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <RotateCcw size={10} /> 초기화
            </button>
          )}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />

      {/* Owner */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelSt}>제작자 / 소유자</label>
        <input
          type="text"
          value={filters.owner}
          onChange={(e) => onFiltersChange({ ...filters, owner: e.target.value })}
          placeholder="예: facebook, google, vercel"
          style={{ ...selectStyle, fontFamily: 'inherit' }}
        />
      </div>

      {/* Language + License */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelSt}>언어</label>
          <select value={filters.language} onChange={(e) => onFiltersChange({ ...filters, language: e.target.value })} style={selectStyle}>
            <option value="">전체</option>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={labelSt}>라이선스</label>
          <select value={filters.license} onChange={(e) => onFiltersChange({ ...filters, license: e.target.value })} style={selectStyle}>
            {LICENSES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
      </div>

      {/* Stars */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelSt}>최소 스타</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {STAR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFiltersChange({ ...filters, minStars: opt.value })}
              style={{
                padding: '5px 10px', fontSize: 11, fontWeight: 500, borderRadius: 6, cursor: 'pointer',
                border: filters.minStars === opt.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: filters.minStars === opt.value ? 'var(--accent-muted)' : 'transparent',
                color: filters.minStars === opt.value ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forks */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelSt}>최소 포크</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {FORK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFiltersChange({ ...filters, minForks: opt.value })}
              style={{
                padding: '5px 10px', fontSize: 11, fontWeight: 500, borderRadius: 6, cursor: 'pointer',
                border: filters.minForks === opt.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: filters.minForks === opt.value ? 'var(--accent-muted)' : 'transparent',
                color: filters.minForks === opt.value ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Updated + Sort */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelSt}>업데이트 기간</label>
          <select value={filters.updatedAfter} onChange={(e) => onFiltersChange({ ...filters, updatedAfter: e.target.value })} style={selectStyle}>
            {DATE_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelSt}>정렬</label>
          <select value={filters.sortBy} onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as SearchFilterValues['sortBy'] })} style={selectStyle}>
            <option value="relevance">관련도순</option>
            <option value="stars">스타순</option>
            <option value="updated">최근 업데이트순</option>
            <option value="forks">포크순</option>
          </select>
        </div>
      </div>

      {/* Archive */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={filters.excludeArchived}
          onChange={(e) => onFiltersChange({ ...filters, excludeArchived: e.target.checked })}
          style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
        />
        아카이브된 저장소 제외
      </label>
    </>
  );

  // inline 모드: 모달 안에서 사용 → 패널 내용만 반환
  if (inline) {
    return <div>{filterContent}</div>;
  }

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      <button
        onClick={() => { if (!isOpen) filtersOnOpenRef.current = JSON.stringify(filters); setIsOpen(!isOpen); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
          borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          border: activeCount > 0 ? '2px solid var(--accent)' : '1px solid var(--border)',
          background: activeCount > 0 ? 'var(--accent-muted)' : 'transparent',
          color: activeCount > 0 ? 'var(--accent)' : 'var(--text-secondary)',
          transition: 'all 0.12s',
        }}
      >
        <Filter size={14} />
        필터
        {activeCount > 0 && (
          <span style={{
            width: 18, height: 18, borderRadius: '50%', fontSize: 10, fontWeight: 700,
            background: 'var(--accent)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8, zIndex: 50,
          width: 420, maxHeight: '70vh', overflow: 'auto', padding: 20, borderRadius: 16,
          border: '1px solid var(--border)', background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>검색 필터</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
              <X size={15} />
            </button>
          </div>
          {filterContent}
        </div>
      )}

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8, position: 'absolute', right: 0, top: '100%' }}>
          {filters.owner && <FilterChip label={`@${filters.owner}`} onRemove={() => onFiltersChange({ ...filters, owner: '' })} />}
          {filters.language && <FilterChip label={filters.language} onRemove={() => onFiltersChange({ ...filters, language: '' })} />}
          {filters.license && <FilterChip label={filters.license.toUpperCase()} onRemove={() => onFiltersChange({ ...filters, license: '' })} />}
          {filters.minStars > 0 && <FilterChip label={`★${filters.minStars}+`} onRemove={() => onFiltersChange({ ...filters, minStars: 0 })} />}
          {filters.updatedAfter && <FilterChip label={DATE_OPTIONS.find(d => d.value === filters.updatedAfter)?.label || ''} onRemove={() => onFiltersChange({ ...filters, updatedAfter: '' })} />}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', fontSize: 10, fontWeight: 500, borderRadius: 6,
      background: 'var(--accent-muted)', color: 'var(--accent)',
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }} aria-label={`${label} 필터 제거`}>
        <X size={9} />
      </button>
    </span>
  );
}
