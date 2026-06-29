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
        <div className="scroll-wrapper">
          <ul className="main-menu">
            <li>
              <Link href="/" onClick={onClose} className="menu-header-link">
                홈 (Home)
              </Link>
            </li>
            
            <li className="menu-section">
              <span className="section-title">1. 협회소개</span>
              <div className="submenu-grid">
                <Link href="/about?tab=intro" onClick={onClose}>협회소개 & 설립목적</Link>
                <Link href="/about?tab=leaders" onClick={onClose}>공동리더 & 임원진</Link>
                <Link href="/about?tab=history" onClick={onClose}>협회 연혁</Link>
                <Link href="/about?tab=mou" onClick={onClose}>MOU 기관 현황</Link>
              </div>
            </li>

            <li className="menu-section">
              <span className="section-title">2. 협회활동</span>
              <div className="submenu-grid">
                <Link href="/activities?tab=seroday" onClick={onClose}>세로데이 (네트워킹)</Link>
                <Link href="/activities?tab=mentoring" onClick={onClose}>멘토링데이 (컨설팅)</Link>
                <Link href="/activities?tab=education" onClick={onClose}>교육 · 특강</Link>
                <Link href="/activities?tab=popup" onClick={onClose}>팝업마켓</Link>
              </div>
            </li>

            <li className="menu-section">
              <span className="section-title">3. 회원 & 쇼핑몰</span>
              <div className="submenu-grid">
                <Link href="/members?tab=register" onClick={onClose}>정회원 등록 신청</Link>
                <Link href="/members?tab=directory" onClick={onClose}>회원 디렉토리</Link>
                <Link href="/shop?tab=brand" onClick={onClose}>브랜드관 (쇼핑몰)</Link>
                <Link href="/shop?tab=group" onClick={onClose}>공동구매 & 추천상품</Link>
              </div>
            </li>

            <li className="menu-section">
              <span className="section-title">4. 홍보 & 파트너</span>
              <div className="submenu-grid">
                <Link href="/pr?tab=intro" onClick={onClose}>기업 소개 & 인터뷰</Link>
                <Link href="/pr?tab=videos" onClick={onClose}>홍보영상 & 쇼츠</Link>
                <Link href="/partnership" onClick={onClose}>MOU 및 파트너십</Link>
                <Link href="/archive" onClick={onClose}>창업가 아카이브</Link>
              </div>
            </li>

            <li className="menu-section">
              <span className="section-title">5. 커뮤니티 & 지원</span>
              <div className="submenu-grid">
                <Link href="/community" onClick={onClose}>자유게시판 (협업)</Link>
                <Link href="/notice" onClick={onClose}>협회 공지사항</Link>
                <Link href="/support" onClick={onClose}>창업지원센터 (자료실)</Link>
              </div>
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
