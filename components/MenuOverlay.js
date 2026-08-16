'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { SERVICE_CATEGORIES } from '@/lib/serviceCategories';

export default function MenuOverlay({ isOpen, isBannerVisible = true, onClose }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkRole = (session) => {
      const override = localStorage.getItem('sejong_role_override');
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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
                className="mobile-category-link"
                onClick={onClose}
              >
                {category.title}
              </Link>
            ))}
          </nav>

          <div className="sub-menu-links">
            <div className="auth-links">
              {user ? (
                <>
                  <span className="user-email">{user.email}님</span>
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
                  <Link href="/signup" className="menu-sub-item" onClick={onClose}>
                    회원가입
                  </Link>
                </>
              )}
              <Link href="/mypage" className="menu-sub-item bookmark-link" onClick={onClose}>
                북마크
              </Link>
            </div>

            <div className="association-links">
              {showAdminMenu && (
                <Link href="/admin" className="menu-sub-item icon-link logout-btn" onClick={onClose}>
                  관리자 대시보드
                </Link>
              )}
              <Link href="/proposal" className="menu-sub-item icon-link" onClick={onClose}>
                협업 및 광고 제휴
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
          background: #3f1d14;
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
          max-width: 720px;
          width: 100%;
          padding: 28px 20px 44px;
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
          gap: clamp(12px, 3vh, 22px);
          padding-bottom: 36px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        }

        .mobile-category-link {
          display: block;
          color: var(--color-white);
          font-size: clamp(34px, 12vw, 58px);
          font-weight: 900;
          line-height: 0.96;
          letter-spacing: 0;
          transition: color 0.2s ease, transform 0.2s ease;
          word-break: keep-all;
        }

        .mobile-category-link:hover,
        .mobile-category-link:focus-visible {
          color: var(--color-emerald-medium);
          transform: translateX(4px);
        }

        .sub-menu-links {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          padding-top: 28px;
          padding-bottom: 40px;
        }

        @media (min-width: 480px) {
          .sub-menu-links {
            grid-template-columns: 1fr 1fr;
          }
        }

        .auth-links, .association-links {
          display: flex;
          flex-direction: column;
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

        .bookmark-link {
          margin-top: 4px;
          color: var(--color-sand-medium);
        }

        .icon-link {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @media (min-width: 769px) {
          .menu-inner {
            max-width: var(--max-width-content);
            padding: 96px 20px 60px;
          }

          .mobile-category-menu {
            gap: 18px;
          }

          .mobile-category-link {
            font-size: clamp(42px, 6vw, 72px);
          }
        }
      `}</style>
    </div>
  );
}
