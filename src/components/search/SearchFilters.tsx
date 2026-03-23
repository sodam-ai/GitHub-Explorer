import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export interface SearchFilterValues {
  language: string;
  minStars: number;
  sortBy: 'stars' | 'updated' | 'relevance';
}

interface SearchFiltersProps {
  filters: SearchFilterValues;
  onFiltersChange: (filters: SearchFilterValues) => void;
}

const LANGUAGES = [
  '', 'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java',
  'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
];

const STAR_OPTIONS = [
  { label: '전체', value: 0 },
  { label: '10+', value: 10 },
  { label: '100+', value: 100 },
  { label: '500+', value: 500 },
  { label: '1,000+', value: 1000 },
  { label: '5,000+', value: 5000 },
];

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasFilters = filters.language || filters.minStars > 0 || filters.sortBy !== 'relevance';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
          hasFilters
            ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5'
            : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
        }`}
      >
        <Filter size={14} />
        필터
        {hasFilters && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFiltersChange({ language: '', minStars: 0, sortBy: 'relevance' });
            }}
            className="ml-1 hover:text-red-500"
          >
            <X size={12} />
          </button>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-40 w-72 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">언어</label>
            <select
              value={filters.language}
              onChange={(e) => onFiltersChange({ ...filters, language: e.target.value })}
              className="w-full px-2 py-1.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)]"
            >
              <option value="">전체 언어</option>
              {LANGUAGES.filter(Boolean).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">최소 스타</label>
            <div className="flex flex-wrap gap-1.5">
              {STAR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFiltersChange({ ...filters, minStars: opt.value })}
                  className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                    filters.minStars === opt.value
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'border-[var(--border)] hover:border-[var(--accent)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">정렬</label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as SearchFilterValues['sortBy'] })}
              className="w-full px-2 py-1.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)]"
            >
              <option value="relevance">관련도순</option>
              <option value="stars">스타순</option>
              <option value="updated">최근 업데이트순</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
