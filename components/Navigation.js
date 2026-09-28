'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SERVICE_CATEGORIES } from '@/lib/serviceCategories';
import MenuOverlay from './MenuOverlay';
import SearchOverlay from './SearchOverlay';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkRole = () => {
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

    const { data } = supabase.auth.onAuthStateChange(() => {
      checkRole();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const showAdminMenu = userRole === 'super_admin' || userRole === 'staff_admin';

  return (
    <>
      <header className="header-container">
        {/* Main GNB */}
        <nav className="gnb-bar glass-panel">
          <div className="gnb-inner">
            <Link href="/" className="logo-text">
              SELO
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="nav-links pc-only">
              {SERVICE_CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link href={category.href} className={pathname === category.href ? 'active' : ''}>
                    {category.title}
                  </Link>
                </li>
              ))}
              {showAdminMenu && (
                <li>
                  <Link href="/admin" className={pathname.startsWith('/admin') ? 'active' : ''} style={{ color: 'var(--color-orange-accent)' }}>
                    관리자
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
        isBannerVisible={false}
        onClose={() => setIsMenuOpen(false)}
      />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
