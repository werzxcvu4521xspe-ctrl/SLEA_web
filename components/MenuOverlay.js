'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function MenuOverlay({ isOpen, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        <ul className="main-menu">
          <li>
            <Link href="/" onClick={onClose}>
              홈 (Home)
            </Link>
          </li>
          <li>
            <Link href="/archive" onClick={onClose}>
              창업가 아카이브 (Archive)
            </Link>
          </li>
          <li>
            <Link href="/map" onClick={onClose}>
              로컬 맵 (Map)
            </Link>
          </li>
          <li>
            <Link href="/notice" onClick={onClose}>
              소식 및 공지사항 (Notice)
            </Link>
          </li>
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
            <Link href="/proposal" className="menu-sub-item icon-link" onClick={onClose}>
              🤝 협업 및 광고 제휴
            </Link>
            <Link href="/mypage" className="menu-sub-item icon-link" onClick={onClose}>
              🏪 로컬 창업 정보 등록 신청
            </Link>
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
          background: var(--glass-bg-dark);
          backdrop-filter: var(--glass-blur);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-white);
        }

        .menu-inner {
          display: flex;
          flex-direction: column;
          max-width: 600px;
          width: 100%;
          padding: 40px 20px;
        }

        .main-menu {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .main-menu li a {
          font-size: 28px;
          font-weight: 800;
          color: var(--color-white);
          transition: color 0.2s ease;
          display: inline-block;
        }

        .main-menu li a:hover {
          color: var(--color-emerald-light);
        }

        .divider {
          border: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 30px 0;
        }

        .sub-menu-links {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
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
          font-size: 15px;
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
          margin-top: 8px;
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
