'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
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
      // Priority 1: Local override for demo/testing
      const override = localStorage.getItem('sejong_role_override');
      if (override) {
        setUserRole(override === 'none' ? null : override);
        return;
      }
      
      if (!isSupabaseConfigured) {
        const localUserStr = localStorage.getItem('sejong_session_user');
        if (localUserStr) {
          try {
            const localUser = JSON.parse(localUserStr);
            setUserRole(localUser.role || 'visitor');
          } catch {
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
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

    let subscription = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(() => {
        checkRole();
      });
      subscription = data.subscription;
    }

    window.addEventListener('storage', checkRole);
    window.addEventListener('sejong_role_update', checkRole);

    return () => {
      if (subscription) subscription.unsubscribe();
      window.removeEventListener('storage', checkRole);
      window.removeEventListener('sejong_role_update', checkRole);
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
        isBannerVisible={false}
        onClose={() => setIsMenuOpen(false)}
      />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
