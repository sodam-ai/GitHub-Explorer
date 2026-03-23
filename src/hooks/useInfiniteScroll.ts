import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(
  onLoadMore: () => void,
  options: { enabled?: boolean; threshold?: number } = {}
) {
  const { enabled = true, threshold = 200 } = options;
  const observerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && enabled && !loadingRef.current) {
        loadingRef.current = true;
        onLoadMore();
        setTimeout(() => { loadingRef.current = false; }, 1000);
      }
    },
    [onLoadMore, enabled]
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `${threshold}px`,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  return observerRef;
}
