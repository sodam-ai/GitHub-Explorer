export function SkeletonCard() {
  return (
    <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-card)] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
        <div className="flex-1">
          <div className="h-4 w-48 bg-[var(--border)] rounded" />
          <div className="h-3 w-24 bg-[var(--border)] rounded mt-1.5" />
        </div>
        <div className="h-4 w-12 bg-[var(--border)] rounded" />
      </div>
      <div className="mt-3 h-3 w-full bg-[var(--border)] rounded" />
      <div className="mt-1.5 h-3 w-3/4 bg-[var(--border)] rounded" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-16 bg-[var(--border)] rounded-full" />
        <div className="h-5 w-16 bg-[var(--border)] rounded-full" />
        <div className="h-5 w-16 bg-[var(--border)] rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonSummary() {
  return (
    <div className="p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 animate-pulse">
      <div className="flex items-start gap-2">
        <div className="w-4 h-4 rounded bg-[var(--accent)]/30 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-full bg-[var(--accent)]/20 rounded" />
          <div className="h-3 w-4/5 bg-[var(--accent)]/20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      <SkeletonSummary />
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
