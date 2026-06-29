'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MenuOverlay from './MenuOverlay';
import SearchOverlay from './SearchOverlay';

export default function Navigation() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsBannerVisible(false);
      } else {
        setIsBannerVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header-container ${!isBannerVisible ? 'scrolled' : ''}`}>
        {/* Top Announcement Banner */}
        <div className={`top-banner ${!isBannerVisible ? 'hidden' : ''}`}>
          <div className="banner-content">
            <span>세종시 로컬 창업가의 생생한 성장 기록, 아카이빙 신청 접수 중!</span>
            <Link href="/archive" className="banner-link">
              신청하기 <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        {/* Main GNB */}
        <nav className="gnb-bar glass-panel">
          <div className="gnb-inner">
            <Link href="/" className="logo-text" onClick={() => setIsMegaOpen(false)}>
              SEJONG <span>LOCAL</span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="nav-links pc-only">
              <li>
                <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={() => setIsMegaOpen(false)}>
                  홈
                </Link>
              </li>
              <li>
                <Link href="/about" className={pathname.startsWith('/about') ? 'active' : ''} onClick={() => setIsMegaOpen(false)}>
                  협회소개
                </Link>
              </li>
              <li>
                <Link href="/activities" className={pathname.startsWith('/activities') ? 'active' : ''} onClick={() => setIsMegaOpen(false)}>
                  협회활동
                </Link>
              </li>
              <li>
                <Link href="/members" className={pathname.startsWith('/members') ? 'active' : ''} onClick={() => setIsMegaOpen(false)}>
                  회원관리
                </Link>
              </li>
              <li>
                <Link href="/shop" className={pathname.startsWith('/shop') ? 'active' : ''} onClick={() => setIsMegaOpen(false)}>
                  쇼핑몰
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={`mega-trigger-btn ${isMegaOpen ? 'active' : ''}`}
                  onClick={() => setIsMegaOpen(!isMegaOpen)}
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: isMegaOpen ? 'var(--color-emerald-deep)' : 'var(--color-gray-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 0',
                    transition: 'color 0.2s ease'
                  }}
                >
                  전체 서비스 {isMegaOpen ? '▲' : '▼'}
                </button>
              </li>
            </ul>

            {/* Icons / Controls */}
            <div className="header-controls">
              <button 
                type="button" 
                className="icon-btn search-btn" 
                onClick={() => { setIsSearchOpen(true); setIsMegaOpen(false); }}
                aria-label="검색 열기"
              >
                🔍
              </button>
              <button 
                type="button" 
                className={`icon-btn menu-btn ${isMenuOpen ? 'open' : ''}`}
                onClick={() => { setIsMenuOpen(!isMenuOpen); setIsMegaOpen(false); }}
                aria-label="메뉴 열기"
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mega Menu Overlay */}
        <div className={`mega-menu-overlay ${isMegaOpen ? 'active' : ''}`}>
          <div className="mega-menu-grid">
            <div className="mega-menu-col">
              <div className="mega-menu-title">1. 협회소개</div>
              <Link href="/about?tab=intro" onClick={() => setIsMegaOpen(false)}>협회소개 & 설립목적</Link>
              <Link href="/about?tab=leaders" onClick={() => setIsMegaOpen(false)}>공동리더 & 임원진</Link>
              <Link href="/about?tab=history" onClick={() => setIsMegaOpen(false)}>협회 연혁</Link>
              <Link href="/about?tab=mou" onClick={() => setIsMegaOpen(false)}>MOU 기관 현황</Link>
            </div>
            
            <div className="mega-menu-col">
              <div className="mega-menu-title">2. 협회활동</div>
              <Link href="/activities?tab=seroday" onClick={() => setIsMegaOpen(false)}>세로데이 (네트워킹)</Link>
              <Link href="/activities?tab=mentoring" onClick={() => setIsMegaOpen(false)}>멘토링데이 (컨설팅)</Link>
              <Link href="/activities?tab=education" onClick={() => setIsMegaOpen(false)}>교육 · 특강</Link>
              <Link href="/activities?tab=popup" onClick={() => setIsMegaOpen(false)}>팝업마켓</Link>
            </div>

            <div className="mega-menu-col">
              <div className="mega-menu-title">3. 회원 & 쇼핑몰</div>
              <Link href="/members?tab=register" onClick={() => setIsMegaOpen(false)}>정회원 등록 신청</Link>
              <Link href="/members?tab=directory" onClick={() => setIsMegaOpen(false)}>회원 디렉토리</Link>
              <Link href="/shop?tab=brand" onClick={() => setIsMegaOpen(false)}>브랜드관 (쇼핑몰)</Link>
              <Link href="/shop?tab=group" onClick={() => setIsMegaOpen(false)}>공동구매 & 추천상품</Link>
            </div>

            <div className="mega-menu-col">
              <div className="mega-menu-title">4. 홍보 & 파트너</div>
              <Link href="/pr?tab=intro" onClick={() => setIsMegaOpen(false)}>기업 소개 & 인터뷰</Link>
              <Link href="/pr?tab=videos" onClick={() => setIsMegaOpen(false)}>홍보영상 & 쇼츠</Link>
              <Link href="/partnership" onClick={() => setIsMegaOpen(false)}>MOU 및 파트너십</Link>
              <Link href="/archive" onClick={() => setIsMegaOpen(false)}>창업가 아카이브</Link>
            </div>

            <div className="mega-menu-col">
              <div className="mega-menu-title">5. 커뮤니티 & 지원</div>
              <Link href="/community" onClick={() => setIsMegaOpen(false)}>자유게시판 (협업)</Link>
              <Link href="/notice" onClick={() => setIsMegaOpen(false)}>협회 공지사항</Link>
              <Link href="/support" onClick={() => setIsMegaOpen(false)}>창업지원센터 (자료실)</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Overlays */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
