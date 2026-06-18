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
            <Link href="/" className="logo-text">
              SEJONG <span>LOCAL</span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="nav-links pc-only">
              <li>
                <Link href="/" className={pathname === '/' ? 'active' : ''}>
                  홈
                </Link>
              </li>
              <li>
                <Link href="/archive" className={pathname.startsWith('/archive') ? 'active' : ''}>
                  창업가 아카이브
                  <span className="badge badge-apply">신청중</span>
                </Link>
              </li>
              <li>
                <Link href="/map" className={pathname === '/map' ? 'active' : ''}>
                  로컬 맵
                </Link>
              </li>
              <li>
                <Link href="/notice" className={pathname.startsWith('/notice') ? 'active' : ''}>
                  공지사항
                </Link>
              </li>
            </ul>

            {/* Icons / Controls */}
            <div className="header-controls">
              <button 
                type="button" 
                className="icon-btn search-btn" 
                onClick={() => setIsSearchOpen(true)}
                aria-label="검색 열기"
              >
                🔍
              </button>
              <button 
                type="button" 
                className={`icon-btn menu-btn ${isMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="메뉴 열기"
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Overlays */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <style jsx global>{`
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: transform 0.4s ease;
        }

        .top-banner {
          height: var(--banner-height);
          background-color: var(--color-emerald-deep);
          color: var(--color-sand-warm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 500;
          transition: height 0.3s ease, opacity 0.3s ease;
          overflow: hidden;
        }

        .top-banner.hidden {
          height: 0;
          opacity: 0;
        }

        .banner-content {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .banner-link {
          color: var(--color-orange-accent);
          font-weight: 600;
          text-decoration: underline;
        }

        .gnb-bar {
          height: var(--header-height);
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: var(--glass-blur);
          transition: background 0.3s ease;
        }

        .header-container.scrolled .gnb-bar {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: var(--shadow-subtle);
        }

        .gnb-inner {
          max-width: var(--max-width-content);
          height: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: var(--color-charcoal-deep);
          font-family: var(--font-family-condensed);
        }

        .logo-text span {
          color: var(--color-emerald-medium);
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-links li {
          position: relative;
        }

        .nav-links a {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-gray-dark);
          padding: 8px 0;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
        }

        .nav-links a:hover, .nav-links a.active {
          color: var(--color-emerald-deep);
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--color-emerald-deep);
          transition: width 0.3s ease;
        }

        .nav-links a.active::after {
          width: 100%;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          font-size: 20px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-charcoal-deep);
          transition: opacity 0.2s ease;
        }

        .icon-btn:hover {
          opacity: 0.7;
        }

        /* Hamburger Menu Icon */
        .menu-btn {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 24px;
        }

        .menu-btn .bar {
          display: block;
          width: 100%;
          height: 2px;
          background-color: var(--color-charcoal-deep);
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .menu-btn.open .bar:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .menu-btn.open .bar:nth-child(2) {
          opacity: 0;
        }

        .menu-btn.open .bar:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .pc-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
