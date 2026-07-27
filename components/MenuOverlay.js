'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { SERVICE_CATEGORIES } from '@/lib/serviceCategories';

export default function MenuOverlay({ isOpen, onClose }) {
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
    <div className="menu-overlay">
      <div className="menu-inner container animate-fade-in">
        <div className="scroll-wrapper">
          <ul className="main-menu">
            <li>
              <Link href="/" onClick={onClose} className="menu-header-link">
                홈 (Home)
              </Link>
            </li>
            
            {SERVICE_CATEGORIES.map((category) => (
              <li className="menu-section" key={category.slug}>
                <span className="section-title">{category.number}. {category.title}</span>
                <div className="submenu-grid">
                  {category.topics.map((topic) => (
                    <Link href={category.href} onClick={onClose} key={topic}>{topic}</Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <hr className="divider" />

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
                🔖 북마크
              </Link>
            </div>

            <div className="association-links">
              {showAdminMenu && (
                <Link href="/admin" className="menu-sub-item icon-link logout-btn" onClick={onClose}>
                  👑 관리자 대시보드
                </Link>
              )}
              <Link href="/proposal" className="menu-sub-item icon-link" onClick={onClose}>
                🤝 협업 및 광고 제휴
              </Link>
              <Link href="/mypage" className="menu-sub-item icon-link" onClick={onClose}>
                🏪 로컬 창업 정보 등록 신청
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .menu-overlay {
          position: fixed;
          top: var(--header-height);
          left: 0;
          width: 100vw;
          height: calc(100vh - var(--header-height));
          background: rgba(26, 26, 26, 0.98);
          backdrop-filter: var(--glass-blur);
          z-index: 999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          color: var(--color-white);
          overflow-y: auto;
        }

        .menu-inner {
          display: flex;
          flex-direction: column;
          max-width: 600px;
          width: 100%;
          padding: 20px;
        }

        .scroll-wrapper {
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          padding-right: 8px;
        }

        .main-menu {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .menu-header-link {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-white);
          transition: color 0.2s ease;
        }

        .menu-header-link:hover {
          color: var(--color-emerald-light);
        }

        .menu-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 800;
          color: var(--color-emerald-light);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .submenu-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding-left: 8px;
        }

        .submenu-grid a {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-gray-light);
          transition: color 0.2s ease;
        }

        .submenu-grid a:hover {
          color: var(--color-white);
        }

        .divider {
          border: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          margin: 24px 0;
        }

        .sub-menu-links {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
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
          gap: 12px;
        }

        .user-email {
          font-size: 13px;
          color: var(--color-gray-medium);
          margin-bottom: 4px;
        }

        .menu-sub-item {
          font-size: 14px;
          font-weight: 600;
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
      `}</style>
    </div>
  );
}
