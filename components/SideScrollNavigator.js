'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BOOKMARK_KEY = 'sejong_quick_bookmarks';
const HIDDEN_PATH_PREFIXES = ['/admin', '/login', '/signup', '/find-auth', '/mypage'];

const fallbackSections = [
  { id: 'top', label: 'Top' },
  { id: 'main', label: 'Main' },
  { id: 'footer', label: 'Footer' }
];

function Icon({ type }) {
  const common = {
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true'
  };

  if (type === 'bookmark') {
    return <svg {...common}><path d="M6 4h12v17l-6-4-6 4V4z" /></svg>;
  }
  if (type === 'share') {
    return <svg {...common}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2" /></svg>;
  }
  if (type === 'play') {
    return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="m10 8 6 4-6 4V8z" fill="currentColor" stroke="none" /></svg>;
  }
  if (type === 'bell') {
    return <svg {...common}><path d="M6 9a6 6 0 0 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8z" /><path d="M10 21h4" /></svg>;
  }
  if (type === 'chat') {
    return <svg {...common}><path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.8-5A8 8 0 1 1 21 12z" /></svg>;
  }
  if (type === 'spark') {
    return <svg {...common}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></svg>;
  }
  return <svg {...common}><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>;
}

function sectionLabelFromElement(element, index) {
  const labelledBy = element.getAttribute('aria-labelledby');
  const explicitLabel = element.getAttribute('data-scroll-label');
  const heading = labelledBy
    ? document.getElementById(labelledBy)
    : element.querySelector('h1, h2, h3, .section-label, .page-hero-title');

  return (explicitLabel || heading?.textContent || `Section ${index + 1}`)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 18);
}

export default function SideScrollNavigator() {
  const pathname = usePathname();
  const [sections, setSections] = useState(fallbackSections);
  const [activeId, setActiveId] = useState('top');
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('섹션 바로가기');
  const [isHintVisible, setIsHintVisible] = useState(true);

  const shouldHide = useMemo(() => (
    HIDDEN_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  ), [pathname]);

  useEffect(() => {
    if (shouldHide) return;

    const nodes = Array.from(document.querySelectorAll('main section, footer'))
      .filter((node) => node.getBoundingClientRect().height > 80)
      .slice(0, 8);

    const nextSections = [
      { id: 'top', label: 'Top' },
      ...nodes.map((node, index) => {
        if (!node.id) node.id = `page-section-${index + 1}`;
        return {
          id: node.id,
          label: sectionLabelFromElement(node, index)
        };
      })
    ];

    const timer = window.setTimeout(() => {
      setSections(nextSections.length > 1 ? nextSections : fallbackSections);
      setActiveId('top');
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, shouldHide]);

  useEffect(() => {
    if (shouldHide) return undefined;

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)) : 0;
      setProgress(nextProgress);

      const activeSection = sections
        .map((section) => ({
          id: section.id,
          top: section.id === 'top'
            ? 0
            : (document.getElementById(section.id)?.getBoundingClientRect().top || 9999)
        }))
        .filter((section) => section.top <= 180)
        .at(-1);

      if (activeSection) setActiveId(activeSection.id);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [sections, shouldHide]);

  const scrollToSection = useCallback((id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const saveBookmark = () => {
    const current = {
      title: document.title,
      url: window.location.href,
      savedAt: new Date().toISOString()
    };
    const previous = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify([current, ...previous.slice(0, 9)]));
    setNotice('북마크 저장됨');
    setIsHintVisible(true);
  };

  const sharePage = async () => {
    const shareData = { title: document.title, url: window.location.href };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setNotice('공유 준비 완료');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice('링크 복사됨');
      }
      setIsHintVisible(true);
    } catch (error) {
      setNotice('공유 취소됨');
      setIsHintVisible(true);
    }
  };

  useEffect(() => {
    if (!isHintVisible) return undefined;
    const timer = window.setTimeout(() => setIsHintVisible(false), 3600);
    return () => window.clearTimeout(timer);
  }, [isHintVisible, notice]);

  if (shouldHide) return null;

  return (
    <aside className="side-scroll-navigator" aria-label="오른쪽 사이드 스크롤 네비게이터">
      {isHintVisible && (
        <div className="side-nav-hint" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setIsHintVisible(false)} aria-label="안내 닫기">×</button>
        </div>
      )}

      <div className="side-nav-panel">
        <div className="side-nav-progress" aria-hidden="true">
          <span style={{ height: `${progress}%` }} />
        </div>

        <button type="button" className="side-nav-button top-button" onClick={() => scrollToSection('top')} aria-label="맨 위로 이동">
          <Icon type="top" />
        </button>

        <div className="side-nav-section-dots" aria-label="페이지 섹션 이동">
          {sections.slice(1, 7).map((section, index) => (
            <button
              key={section.id}
              type="button"
              className={activeId === section.id ? 'active' : ''}
              onClick={() => scrollToSection(section.id)}
              aria-label={`${section.label} 섹션으로 이동`}
            >
              <span>{index + 1}</span>
              <small>{section.label}</small>
            </button>
          ))}
        </div>

        <button type="button" className="side-nav-button" onClick={saveBookmark} aria-label="현재 페이지 북마크">
          <Icon type="bookmark" />
        </button>
        <button type="button" className="side-nav-button" onClick={sharePage} aria-label="현재 페이지 공유">
          <Icon type="share" />
        </button>
        <Link href="/sero-members" className="side-nav-button" aria-label="세로 회원사 콘텐츠 보기">
          <Icon type="play" />
        </Link>
        <Link href="/notice" className="side-nav-button" aria-label="공지사항 보기">
          <Icon type="bell" />
        </Link>
        <Link href="/sero-talk" className="side-nav-button badge-button" aria-label="세로 토크 열기">
          <Icon type="chat" />
          <span>7</span>
        </Link>
        <Link href="/sero-ai-start" className="side-nav-button" aria-label="세로 AI 스타트 열기">
          <Icon type="spark" />
        </Link>
      </div>
    </aside>
  );
}
