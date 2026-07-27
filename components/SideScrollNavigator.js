'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

const HIDDEN_PATH_PREFIXES = ['/admin', '/login', '/signup', '/find-auth', '/mypage'];

export default function SideScrollNavigator() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  const shouldHide = useMemo(() => (
    HIDDEN_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  ), [pathname]);

  useEffect(() => {
    if (shouldHide) return undefined;

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0
        ? Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100))
        : 0;

      setProgress(nextProgress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [shouldHide]);

  if (shouldHide) return null;

  return (
    <aside className="side-scroll-navigator" aria-label="페이지 스크롤 진행률">
      <div
        className="side-scroll-progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(progress)}
      >
        <span style={{ height: `${progress}%` }} />
      </div>
    </aside>
  );
}
