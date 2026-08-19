'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BOOKMARK_STORAGE_KEY } from '@/components/BookmarkButton';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const SHOP_STORAGE_KEY = 'sejong_sero_service_sero-shop';
const MENTORING_STORAGE_KEY = 'sejong_sero_service_mentoring-day';
const TALK_STORAGE_KEY = 'sejong_sero_service_sero-talk';
const ROLE_OVERRIDE_KEY = 'sejong_role_override';
const DEMO_MEMBER = {
  id: 'demo-member',
  email: 'member@selo.local',
  user_metadata: {
    name: '일반 회원',
    brand: 'SELO 테스트 브랜드',
    company_name: 'SELO 테스트 브랜드',
    role: 'user'
  }
};

const readStoredList = (key) => {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
};

const writeStoredList = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

const getReactionStats = (item, index) => {
  const source = String(item.id || item.title || index);
  const seed = source.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    views: 90 + (seed % 320),
    comments: 2 + (seed % 18),
    likes: 12 + (seed % 74)
  };
};

const getUserBrand = (user) => (
  user?.user_metadata?.brand
  || user?.user_metadata?.company_name
  || user?.user_metadata?.companyName
  || ''
).trim();

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [mentoringItems, setMentoringItems] = useState([]);
  const [talkPosts, setTalkPosts] = useState([]);
  const [shopForm, setShopForm] = useState({
    product: '',
    brand: '',
    price: '',
    imageUrl: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'SELO 회원';
  const userBrand = getUserBrand(user);

  const refreshDashboard = () => {
    setBookmarks(readStoredList(BOOKMARK_STORAGE_KEY));
    setShopItems(readStoredList(SHOP_STORAGE_KEY));
    setMentoringItems(readStoredList(MENTORING_STORAGE_KEY));
    setTalkPosts(readStoredList(TALK_STORAGE_KEY));
  };

  useEffect(() => {
    const useDemoMember = () => {
      setUser(DEMO_MEMBER);
      refreshDashboard();
      setLoading(false);
    };

    const checkSession = async () => {
      if (localStorage.getItem(ROLE_OVERRIDE_KEY) === 'user') {
        useDemoMember();
        return;
      }

      if (!isSupabaseConfigured) {
        const localUserStr = localStorage.getItem('sejong_session_user');
        if (localUserStr) {
          try {
            const localUser = JSON.parse(localUserStr);
            // Translate structure so layout looks same
            setUser({
              ...localUser,
              user_metadata: {
                name: localUser.name || '테스트 회원',
                brand: localUser.brand || '로컬 브랜드',
                company_name: localUser.brand || '로컬 브랜드',
                role: localUser.role
              }
            });
            refreshDashboard();
            setLoading(false);
          } catch {
            router.replace('/login');
          }
        } else {
          router.replace('/login');
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('/login');
        return;
      }

      setUser(session.user);
      refreshDashboard();
      setLoading(false);
    };

    checkSession();

    let subscription = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (localStorage.getItem(ROLE_OVERRIDE_KEY) === 'user') {
          useDemoMember();
          return;
        }

        if (!session?.user) {
          router.replace('/login');
          return;
        }
        setUser(session.user);
        refreshDashboard();
        setLoading(false);
      });
      subscription = data.subscription;
    }

    window.addEventListener('selo_bookmark_update', refreshDashboard);
    return () => {
      if (subscription) subscription.unsubscribe();
      window.removeEventListener('selo_bookmark_update', refreshDashboard);
    };
  }, [router]);

  useEffect(() => {
    if (!userBrand) return;

    setShopForm((prev) => (
      prev.brand.trim() ? prev : { ...prev, brand: userBrand }
    ));
  }, [userBrand]);

  const mentoringBriefs = useMemo(() => (
    mentoringItems.map((item, index) => ({
      ...item,
      step: index % 3 === 0 ? '접수 완료' : index % 3 === 1 ? '멘토 매칭중' : '일정 조율중',
      next: index % 3 === 0 ? '담당자가 상담 분야를 검토합니다.' : index % 3 === 1 ? '전문가 후보를 확인하고 있습니다.' : '가능한 상담 시간을 조율합니다.'
    }))
  ), [mentoringItems]);

  const talkReports = useMemo(() => (
    talkPosts.map((post, index) => ({
      ...post,
      ...getReactionStats(post, index)
    }))
  ), [talkPosts]);

  const handleLogout = async () => {
    localStorage.removeItem(ROLE_OVERRIDE_KEY);
    localStorage.removeItem('sejong_session_user');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('sejong_role_update'));
    await supabase.auth.signOut();
    router.push('/login');
  };

  const updateShopField = (field, value) => {
    setShopForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleShopImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateShopField('imageUrl', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitShopItem = (event) => {
    event.preventDefault();
    const sourceBrand = (userBrand || shopForm.brand).trim();
    if (!shopForm.product.trim() || !sourceBrand) return;

    const nextItem = {
      id: `mypage-shop-${Date.now()}`,
      ...shopForm,
      product: shopForm.product.trim(),
      brand: sourceBrand,
      source: sourceBrand,
      price: shopForm.price.trim(),
      description: shopForm.description.trim(),
      authorEmail: user.email,
      authorName: userName,
      status: '검토중',
      createdAt: new Date().toISOString()
    };

    const nextItems = [nextItem, ...shopItems];
    writeStoredList(SHOP_STORAGE_KEY, nextItems);
    setShopItems(nextItems);
    setShopForm({ product: '', brand: userBrand, price: '', imageUrl: '', description: '' });
    setMessage('쇼핑 콘텐츠 등록 신청이 저장되었습니다.');
    window.setTimeout(() => setMessage(''), 2600);
  };

  const removeBookmark = (id) => {
    const nextBookmarks = bookmarks.filter((item) => item.id !== id);
    writeStoredList(BOOKMARK_STORAGE_KEY, nextBookmarks);
    setBookmarks(nextBookmarks);
  };

  if (loading) {
    return (
      <main className="mypage-loading">
        <p>로그인 상태를 확인하고 있습니다.</p>
        <style jsx>{`
          .mypage-loading {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #111111;
            color: #ffffff;
            font-weight: 900;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="mypage">
      <section className="mypage-hero">
        <div className="dashboard-container">
          <div>
            <span className="eyebrow">MY SELO</span>
            <h1>마이페이지</h1>
            <p>{userName}님의 저장 콘텐츠, 등록 신청, 멘토링 진행, 세로토크 반응을 확인합니다.</p>
          </div>
          <button type="button" onClick={handleLogout}>로그아웃</button>
        </div>
      </section>

      <section className="dashboard-container dashboard-grid">
        <article className="panel wide">
          <div className="panel-title-row">
            <span>BOOKMARK</span>
            <strong>{bookmarks.length}개 저장됨</strong>
          </div>
          <div className="bookmark-grid">
            {bookmarks.map((item) => (
              <div key={item.id} className="bookmark-card">
                {item.imageUrl && <img src={item.imageUrl} alt={`${item.title} 썸네일`} />}
                <div>
                  <span>{item.type}</span>
                  <Link href={item.href}>{item.title}</Link>
                  <p>{item.excerpt}</p>
                  <button type="button" onClick={() => removeBookmark(item.id)}>삭제</button>
                </div>
              </div>
            ))}
            {bookmarks.length === 0 && (
              <div className="empty-state">
                공지사항 또는 세로 회원사 콘텐츠 상세 페이지에서 북마크를 눌러 저장해 보세요.
              </div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-title-row">
            <span>SHOP UPLOAD</span>
            <strong>상품 콘텐츠 등록</strong>
          </div>
          <form className="dashboard-form" onSubmit={submitShopItem}>
            <input required value={shopForm.product} onChange={(event) => updateShopField('product', event.target.value)} placeholder="상품명" />
            <input required value={shopForm.brand} onChange={(event) => updateShopField('brand', event.target.value)} placeholder="브랜드/회원사명" />
            {userBrand && <small className="source-helper">회원가입 정보의 브랜드/회사명이 출처로 자동 포함됩니다.</small>}
            <input value={shopForm.price} onChange={(event) => updateShopField('price', event.target.value)} placeholder="가격 예: 22,900원" />
            <input type="file" accept="image/*" onChange={handleShopImageUpload} />
            <textarea value={shopForm.description} onChange={(event) => updateShopField('description', event.target.value)} placeholder="상품 소개" />
            <button type="submit">쇼핑 콘텐츠 저장</button>
            {message && <em>{message}</em>}
          </form>
          <div className="mini-list">
            {shopItems.slice(0, 3).map((item) => (
              <div key={item.id}>
                <strong>{item.product}</strong>
                <span>{item.brand} · {item.status || '검토중'}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-title-row">
            <span>MENTORING</span>
            <strong>진행사항 브리핑</strong>
          </div>
          <div className="timeline-list">
            {mentoringBriefs.slice(0, 4).map((item) => (
              <div key={item.id || item.createdAt}>
                <span>{item.step}</span>
                <strong>{item.brand || '멘토링 신청'}</strong>
                <p>{item.field || '상담 분야'} · {item.next}</p>
              </div>
            ))}
            {mentoringBriefs.length === 0 && (
              <div className="empty-state">아직 저장된 멘토링 신청이 없습니다.</div>
            )}
          </div>
          <Link href="/mentoring-day" className="text-link">멘토링 신청하러 가기 →</Link>
        </article>

        <article className="panel wide">
          <div className="panel-title-row">
            <span>SERO TALK</span>
            <strong>내 게시물 반응</strong>
          </div>
          <div className="reaction-grid">
            {talkReports.map((post) => (
              <div key={post.id} className="reaction-card">
                <span>{post.type}</span>
                <strong>{post.title}</strong>
                <div>
                  <b>{post.views}</b> 조회
                  <b>{post.comments}</b> 댓글
                  <b>{post.likes}</b> 좋아요
                </div>
              </div>
            ))}
            {talkReports.length === 0 && (
              <div className="empty-state">세로 토크에 올린 게시물이 아직 없습니다.</div>
            )}
          </div>
          <Link href="/sero-talk" className="text-link">세로 토크 글쓰기 →</Link>
        </article>
      </section>

      <style jsx>{`
        .mypage {
          background: #f8f8f8;
          color: #161616;
          min-height: 100vh;
        }

        .dashboard-container {
          width: min(100%, 1440px);
          margin: 0 auto;
          padding-left: clamp(20px, 4vw, 56px);
          padding-right: clamp(20px, 4vw, 56px);
        }

        .mypage-hero {
          margin-top: var(--header-height);
          background: #111111;
          color: #ffffff;
        }

        .mypage-hero .dashboard-container {
          min-height: 300px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          padding-top: 80px;
          padding-bottom: 48px;
        }

        .eyebrow,
        .panel-title-row span {
          display: block;
          margin-bottom: 14px;
          color: #ff5a2a;
          font-family: var(--font-family-condensed);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        h1 {
          color: #ffffff;
          font-family: var(--font-family-condensed);
          font-size: clamp(48px, 7vw, 104px);
          font-weight: 900;
          line-height: 1;
        }

        .mypage-hero p {
          max-width: 760px;
          margin-top: 18px;
          color: #d7d7d7;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.6;
          word-break: keep-all;
        }

        .mypage-hero button,
        .dashboard-form button,
        .bookmark-card button {
          min-height: 44px;
          padding: 0 18px;
          background: #ff5a2a;
          color: #ffffff;
          font-weight: 900;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 22px;
          padding-top: 42px;
          padding-bottom: 96px;
        }

        .panel {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          padding: clamp(24px, 3vw, 38px);
        }

        .panel-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 18px;
        }

        .panel-title-row strong {
          font-family: var(--font-family-condensed);
          font-size: clamp(24px, 2.4vw, 36px);
          font-weight: 900;
          line-height: 1.1;
        }

        .bookmark-grid,
        .reaction-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 16px;
        }

        .bookmark-card {
          display: grid;
          grid-template-columns: 120px minmax(0, 1fr);
          gap: 18px;
          border: 1px solid #e6e6e6;
          padding: 14px;
        }

        .bookmark-card img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }

        .bookmark-card span,
        .reaction-card span,
        .mini-list span,
        .timeline-list span {
          color: #ff5a2a;
          font-size: 12px;
          font-weight: 900;
        }

        .bookmark-card a,
        .reaction-card strong,
        .mini-list strong,
        .timeline-list strong {
          display: block;
          margin: 6px 0;
          color: #161616;
          font-size: 18px;
          font-weight: 900;
          line-height: 1.35;
        }

        .bookmark-card p,
        .timeline-list p {
          color: #666666;
          font-size: 14px;
          line-height: 1.6;
        }

        .bookmark-card button {
          min-height: 34px;
          margin-top: 10px;
          background: #111111;
          font-size: 13px;
        }

        .dashboard-form,
        .mini-list,
        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dashboard-form input,
        .dashboard-form textarea {
          width: 100%;
          border: 1px solid #d8d8d8;
          padding: 13px 14px;
          font: inherit;
          font-weight: 700;
          background: #ffffff;
        }

        .dashboard-form textarea {
          min-height: 118px;
          resize: vertical;
        }

        .dashboard-form em {
          color: #ff5a2a;
          font-style: normal;
          font-weight: 900;
        }

        .source-helper {
          margin-top: -6px;
          color: #777777;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.5;
        }

        .mini-list {
          margin-top: 22px;
          border-top: 1px solid #e0e0e0;
          padding-top: 16px;
        }

        .mini-list div,
        .timeline-list div,
        .reaction-card {
          border: 1px solid #e6e6e6;
          padding: 16px;
        }

        .reaction-card div {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          color: #666666;
          font-size: 14px;
          font-weight: 800;
        }

        .reaction-card b {
          color: #161616;
          margin-right: -10px;
        }

        .empty-state {
          border: 1px dashed #cfcfcf;
          padding: 24px;
          color: #666666;
          font-weight: 800;
          line-height: 1.6;
        }

        .text-link {
          display: inline-flex;
          margin-top: 18px;
          color: #161616;
          font-weight: 900;
          border-bottom: 2px solid #ff5a2a;
        }

        @media (min-width: 980px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .panel.wide {
            grid-column: span 2;
          }

          .bookmark-grid,
          .reaction-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .mypage-hero .dashboard-container {
            align-items: flex-start;
            flex-direction: column;
          }

          .bookmark-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
