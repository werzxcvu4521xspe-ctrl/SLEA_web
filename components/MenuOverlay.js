'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SERVICE_CATEGORIES } from '@/lib/serviceCategories';

const ROLE_OVERRIDE_KEY = 'sejong_role_override';

export default function MenuOverlay({ isOpen, isBannerVisible = true, onClose }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkRole = (session) => {
      const override = localStorage.getItem(ROLE_OVERRIDE_KEY);
      if (override) {
        setUserRole(override === 'none' ? null : override);
        return;
      }
      if (session?.user) {
        const role = session.user.user_metadata?.role || 'user';
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkRole(session);
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkRole(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showAdminMenu = userRole === 'super_admin' || userRole === 'staff_admin';
  const isDemoLogin = userRole === 'user' || showAdminMenu;
  const isLoggedIn = Boolean(user) || isDemoLogin;
  const displayName = user?.email || (showAdminMenu ? '테스트 관리자' : '일반 회원');

  const handleLogout = async () => {
    localStorage.removeItem(ROLE_OVERRIDE_KEY);
    setUserRole(null);
    setUser(null);
    window.dispatchEvent(new Event('sejong_role_update'));
    await supabase.auth.signOut();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const syncBodyScroll = () => {
      document.body.style.overflow = mobileQuery.matches ? 'hidden' : '';
    };

    syncBodyScroll();

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', syncBodyScroll);
    } else {
      mobileQuery.addListener(syncBodyScroll);
    }

    return () => {
      document.body.style.overflow = '';
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener('change', syncBodyScroll);
      } else {
        mobileQuery.removeListener(syncBodyScroll);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`menu-overlay ${isBannerVisible ? '' : 'banner-hidden'}`}>
      <div className="menu-inner container animate-fade-in">
        <div className="scroll-wrapper">
          <nav className="mobile-category-menu" aria-label="전체 서비스 카테고리">
            {SERVICE_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={category.href}
                className={`mobile-category-link ${pathname === category.href ? 'active' : ''}`}
                onClick={onClose}
              >
                {category.title}
              </Link>
            ))}
          </nav>

          <div className="sub-menu-links">
            <div className="auth-links">
              {isLoggedIn ? (
                <>
                  <span className="user-email">{displayName}님</span>
                  <Link href="/mypage" className="menu-sub-item" onClick={onClose}>
                    마이페이지
                  </Link>
                  <button type="button" className="menu-sub-item logout-btn" onClick={handleLogout}>
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="menu-sub-item" onClick={onClose}>
                    로그인
                  </Link>
                  <Link href="/signup" className="menu-sub-item signup-link" onClick={onClose}>
                    회원가입
                  </Link>
                </>
              )}
            </div>

            <div className="association-links">
              {showAdminMenu && (
                <Link href="/admin" className="menu-sub-item icon-link logout-btn" onClick={onClose}>
                  관리자 대시보드
                </Link>
              )}
              <Link href="/proposal" className="menu-sub-item icon-link" onClick={onClose}>
                협업 및 광고 문의
              </Link>
              <Link href="/mypage" className="menu-sub-item icon-link" onClick={onClose}>
                로컬 창업 정보 등록 신청
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .menu-overlay {
          position: fixed;
          top: calc(var(--banner-height) + var(--header-height));
          left: 0;
          width: 100vw;
          height: calc(100vh - var(--banner-height) - var(--header-height));
          background: #141414;
          backdrop-filter: var(--glass-blur);
          z-index: 999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          color: var(--color-white);
          overflow-y: auto;
        }

        .menu-overlay.banner-hidden {
          top: var(--header-height);
          height: calc(100vh - var(--header-height));
        }

        .menu-inner {
          display: flex;
          flex-direction: column;
          max-width: 680px;
          width: 100%;
          padding: 24px 20px 40px;
        }

        .scroll-wrapper {
          width: 100%;
          max-height: calc(100vh - var(--banner-height) - var(--header-height) - 56px);
          overflow-y: auto;
          padding-right: 8px;
        }

        .menu-overlay.banner-hidden .scroll-wrapper {
          max-height: calc(100vh - var(--header-height) - 56px);
        }

        .mobile-category-menu {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(12px, 2.6vh, 18px);
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        }

        .mobile-category-link {
          display: block;
          color: var(--color-white);
          font-size: clamp(30px, 8.8vw, 54px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: 0;
          transition: color 0.2s ease, transform 0.2s ease;
          word-break: keep-all;
        }

        .mobile-category-link.active {
          color: var(--color-orange-accent);
        }

        .mobile-category-link:hover,
        .mobile-category-link:focus-visible {
          color: var(--color-orange-accent);
          transform: translateX(4px);
        }

        .sub-menu-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          padding-top: 24px;
          padding-bottom: 40px;
        }

        .auth-links, .association-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }

        .user-email {
          font-size: 12px;
          color: var(--color-gray-medium);
          margin-bottom: 4px;
        }

        .menu-sub-item {
          font-size: 15px;
          font-weight: 800;
          color: var(--color-gray-light);
          transition: color 0.2s ease;
          display: inline-block;
          text-align: left;
        }

        .menu-sub-item:hover {
          color: var(--color-white);
        }

        .logout-btn {
          color: var(--color-orange-accent);
        }

        .icon-link {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @media (min-width: 769px) {
          .menu-overlay {
            top: var(--header-height);
            height: 96px;
            min-height: 0;
            max-height: 96px;
            overflow: hidden;
            align-items: center;
            background: #141414;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            border-bottom: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 18px 34px rgba(0, 0, 0, 0.22);
          }

          .menu-inner {
            max-width: var(--max-width-content);
            height: 100%;
            justify-content: center;
            padding: 16px 20px;
          }

          .scroll-wrapper {
            max-height: none;
            overflow: visible;
            padding-right: 0;
          }

          .mobile-category-menu {
            display: none !important;
          }

          .sub-menu-links,
          .auth-links,
          .association-links {
            flex-direction: row;
            align-items: center;
          }

          .sub-menu-links {
            padding: 0;
            gap: 20px;
          }

          .auth-links,
          .association-links {
            gap: 18px;
          }

          .auth-links {
            padding-right: 16px;
          }

          .association-links {
            flex: 1;
            min-width: 0;
            flex-wrap: wrap;
          }

          .signup-link,
          .user-email,
          .logout-btn {
            display: none;
          }

          .menu-sub-item {
            min-height: 36px;
            padding: 0 28px;
            display: inline-flex;
            align-items: center;
            color: var(--color-white);
            border-left: 1px solid rgba(255, 255, 255, 0.28);
            font-family: var(--font-family-condensed);
            font-size: clamp(17px, 1.2vw, 22px);
            font-weight: 900;
            white-space: nowrap;
          }

          .auth-links .menu-sub-item:first-child {
            border-left: 0;
            padding-left: 0;
          }

          .menu-sub-item:hover,
          .menu-sub-item:focus-visible {
            color: var(--color-orange-accent);
          }

          .icon-link {
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
