'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import MenuOverlay from './MenuOverlay';
import SearchOverlay from './SearchOverlay';

export default function Navigation() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
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

  useEffect(() => {
    const checkRole = () => {
      // Priority 1: Local override for demo/testing
      const override = localStorage.getItem('sejong_role_override');
      if (override) {
        setUserRole(override === 'none' ? null : override);
        return;
      }
      
      // Priority 2: Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const role = session.user.user_metadata?.role || 'user';
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      });
    };

    checkRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkRole();
    });

    window.addEventListener('storage', checkRole);
    window.addEventListener('sejong_role_update', checkRole);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', checkRole);
      window.removeEventListener('sejong_role_update', checkRole);
    };
  }, []);

  const showAdminMenu = userRole === 'super_admin' || userRole === 'staff_admin';

  return (
    <>
      <header className={`header-container ${!isBannerVisible ? 'scrolled' : ''}`}>
        {/* Top Announcement Banner */}
        <div className={`top-banner ${!isBannerVisible ? 'hidden' : ''}`}>
          <div className="banner-content">
            <span>세종시 로컬 창업가 정회원 가입 및 브랜드 아카이빙 신청 접수 중</span>
            <Link href="/signup" className="banner-link">
              가입하기 <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        {/* Main GNB */}
        <nav className="gnb-bar glass-panel">
          <div className="gnb-inner">
            <Link href="/" className="logo-text">
              SELO
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="nav-links pc-only">
              {showAdminMenu && (
                <li>
                  <Link href="/admin" className={pathname.startsWith('/admin') ? 'active' : ''} style={{ color: 'var(--color-orange-accent)' }}>
                    👑 관리자
                  </Link>
                </li>
              )}
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
      <MenuOverlay
        isOpen={isMenuOpen}
        isBannerVisible={isBannerVisible}
        onClose={() => setIsMenuOpen(false)}
      />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
