'use client';

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MEMBER_CONTENT_FILTERS, MEMBER_CONTENTS } from '@/lib/memberContents';
import { SERVICE_CATEGORIES, getServiceCategory } from '@/lib/serviceCategories';

const STORAGE_PREFIX = 'sejong_sero_service_';

const scheduleItems = [
  { title: '제18회 세로 데이', meta: '2026.08.28 · 나성동 로컬허브', desc: '회원사 3분 브랜드 소개, 업종별 라운드테이블, 협업 매칭 네트워킹' },
  { title: '제19회 세로 데이', meta: '2026.09.25 · 조치원 청년창업거리', desc: '원도심 상권 협업, 팝업 운영 경험 공유, 현장 투어' },
  { title: '제20회 세로 데이', meta: '2026.10.30 · 세종창조경제혁신센터', desc: '투자/지원사업 발표 피칭과 공공기관 네트워킹' }
];

const products = [
  {
    id: 'rice-bread',
    name: '[무료배송] 세종 쌀식빵 선물 세트',
    brand: '밀마루 베이커리',
    price: 24000,
    category: 'F&B',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'ceramic-cup',
    name: '로컬 흙 머그컵 2P 세트',
    brand: '공방 세종',
    price: 32000,
    category: 'Craft',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'peach-jam',
    name: '[한정특가] 조치원 복숭아잼 2종 세트',
    brand: '디저트 카페 도원',
    price: 18000,
    originalPrice: 24000,
    discount: 25,
    category: 'F&B',
    imageUrl: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?q=80&w=1200&auto=format&fit=crop'
  }
];

const initialTalkPosts = [
  { id: 1, type: '자유 게시판', title: '8월 팝업 행사 같이 나갈 F&B 브랜드를 찾습니다.', author: '도원' },
  { id: 2, type: 'MOU 제안', title: '대학 창업동아리와 회원사 현장실습 연계를 제안합니다.', author: '운영팀' },
  { id: 3, type: '콜라보 프로젝트', title: '세종 복숭아 시즌 공동 패키지 프로젝트 모집', author: '브루어리' }
];

function saveItem(key, item) {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const previous = readItems(key);
  localStorage.setItem(storageKey, JSON.stringify([item, ...previous]));
}

function readItems(key) {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${key}`) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SeroServicePage({ slug }) {
  const category = getServiceCategory(slug);
  const [formState, setFormState] = useState({});
  const [submitted, setSubmitted] = useState('');
  const [cart, setCart] = useState([]);
  const [talkPosts, setTalkPosts] = useState(initialTalkPosts);
  const [talkType, setTalkType] = useState('자유 게시판');
  const [memberFilter, setMemberFilter] = useState('전체');
  const [memberSort, setMemberSort] = useState('latest');

  const cartTotal = useMemo(() => (
    cart.reduce((sum, item) => sum + item.price, 0)
  ), [cart]);

  const filteredMemberContents = useMemo(() => {
    const contents = memberFilter === '전체'
      ? MEMBER_CONTENTS
      : MEMBER_CONTENTS.filter((item) => item.type === memberFilter);

    return [...contents].sort((a, b) => {
      if (memberSort === 'popular') {
        return b.popularity - a.popularity;
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [memberFilter, memberSort]);

  const servicePostCount = useMemo(() => {
    const counts = {
      notice: 2,
      'sero-day': scheduleItems.length,
      'sero-members': MEMBER_CONTENTS.length,
      'sero-ai-start': 0,
      'mentoring-day': 6,
      'sero-shop': products.length,
      'sero-talk': talkPosts.length
    };

    return counts[slug] || 0;
  }, [slug, talkPosts.length]);

  if (!category) {
    return null;
  }

  const updateField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const submitLocalForm = (event, key, message) => {
    event.preventDefault();
    const item = {
      id: `${key}-${Date.now()}`,
      ...formState,
      createdAt: new Date().toISOString()
    };
    saveItem(key, item);
    setSubmitted(message);
    setFormState({});
    window.setTimeout(() => setSubmitted(''), 2400);
  };

  const createTalkPost = (event) => {
    event.preventDefault();
    const post = {
      id: Date.now(),
      type: talkType,
      title: formState.title || '새로운 세로 토크 글',
      author: formState.author || '회원사'
    };
    setTalkPosts([post, ...talkPosts]);
    saveItem('sero-talk', post);
    setSubmitted('세로 토크 글이 등록되었습니다.');
    setFormState({});
  };

  return (
    <div className="sero-service-page">
      <section className="page-hero-banner">
        <div className="container service-hero-inner">
          <div className="service-hero-kicker-row">
            <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>
              {category.eyebrow}
            </span>
            <span className="service-post-count">{servicePostCount} posts</span>
          </div>
          <h1 className="page-hero-title">{category.title}</h1>
          <p className="page-hero-desc">{category.description}</p>
        </div>
      </section>

      <main className="container service-main">
        {slug !== 'sero-members' && (
          <section className="service-overview">
            <div className="service-copy">
              <span className="section-label en-title">Service Topic</span>
              <h2>{category.topics.join(' · ')}</h2>
              <p>이 카테고리에서 바로 필요한 업무를 시작할 수 있도록 신청, 작성, 저장, 추천 기능을 함께 구성했습니다.</p>
            </div>
          </section>
        )}

        {slug === 'notice' && (
          <section className="action-grid">
            <div className="service-panel">
              <h3>협회 공지사항</h3>
              <p>공지 채널에서 이미지 포함 공지 등록, 중요 공지 고정, 카테고리 필터를 사용할 수 있습니다.</p>
              <Link href="/notice" className="service-action-btn">공지 채널 열기</Link>
            </div>
            <div className="service-panel">
              <h3>협회 활동</h3>
              <p>세로데이, 교육, 멘토링, 팝업마켓 등 협회 활동 기록과 신청 기능으로 이동합니다.</p>
              <Link href="/activities" className="service-action-btn">협회 활동 보기</Link>
            </div>
          </section>
        )}

        {slug === 'sero-day' && (
          <section className="action-grid wide-left">
            <div className="service-panel">
              <h3>다가오는 세로 데이</h3>
              <div className="mini-list">
                {scheduleItems.map((item) => (
                  <article key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.meta}</span>
                    <p>{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
            <form className="service-panel service-form" onSubmit={(event) => submitLocalForm(event, 'sero-day', '세로 데이 참가 신청이 저장되었습니다.')}>
              <h3>네트워킹 참가 신청</h3>
              <input required value={formState.name || ''} onChange={(e) => updateField('name', e.target.value)} placeholder="대표자명" />
              <input required value={formState.brand || ''} onChange={(e) => updateField('brand', e.target.value)} placeholder="브랜드/기업명" />
              <textarea required value={formState.interest || ''} onChange={(e) => updateField('interest', e.target.value)} placeholder="만나고 싶은 분야 또는 협업 관심사" />
              <button type="submit">참가 신청 저장</button>
              {submitted && <span className="form-result">{submitted}</span>}
            </form>
          </section>
        )}

        {slug === 'sero-members' && (
          <section className="member-editorial">
            <div className="member-filter-list">
              <div className="member-filter-buttons">
                {MEMBER_CONTENT_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className={memberFilter === filter.value ? 'active' : ''}
                    onClick={() => setMemberFilter(filter.value)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="member-sort-row">
              <span>{filteredMemberContents.length} posts</span>
              <div>
                <button
                  type="button"
                  className={memberSort === 'latest' ? 'active' : ''}
                  onClick={() => setMemberSort('latest')}
                >
                  최신순
                </button>
                <i aria-hidden="true" />
                <button
                  type="button"
                  className={memberSort === 'popular' ? 'active' : ''}
                  onClick={() => setMemberSort('popular')}
                >
                  인기순
                </button>
              </div>
            </div>

            <div className="member-content-grid">
              {filteredMemberContents.map((item) => (
                <Link key={item.id || item.title} href={`/sero-members/${item.id}`} className="member-content-card">
                  <span className="member-card-image">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <span>{item.type}</span>
                  </span>
                  <div className="member-card-copy">
                    <strong>{item.title}</strong>
                    <p>{item.story}</p>
                    <span>{item.brand} · {item.channel}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {slug === 'sero-ai-start' && (
          <section className="service-panel service-ready-panel">
            <span className="section-label en-title">Coming Soon</span>
            <h3>준비중입니다.</h3>
            <p>세로 AI 스타트 콘텐츠와 기능은 현재 준비중입니다.</p>
          </section>
        )}

        {slug === 'mentoring-day' && (
          <>
            <section className="action-grid">
              <div className="service-panel">
                <h3>멘토링 분야</h3>
                <div className="topic-list">
                  {['브랜딩', '마케팅/SNS', '세무/회계', '상품 기획', '온라인 판로', '정부지원사업'].map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <p>신청 내용은 담당자가 확인 후 멘토와 일정을 매칭합니다.</p>
              </div>
              <form className="service-panel service-form" onSubmit={(event) => submitLocalForm(event, 'mentoring-day', '1:1 멘토링 신청이 저장되었습니다.')}>
                <h3>1:1 멘토링 신청</h3>
                <input required value={formState.brand || ''} onChange={(e) => updateField('brand', e.target.value)} placeholder="브랜드/기업명" />
                <select value={formState.field || '브랜딩'} onChange={(e) => updateField('field', e.target.value)}>
                  <option>브랜딩</option>
                  <option>마케팅/SNS</option>
                  <option>세무/회계</option>
                  <option>온라인 판로</option>
                  <option>정부지원사업</option>
                </select>
                <textarea required value={formState.request || ''} onChange={(e) => updateField('request', e.target.value)} placeholder="상담받고 싶은 내용을 적어주세요." />
                <button type="submit">멘토링 신청 저장</button>
                {submitted && <span className="form-result">{submitted}</span>}
              </form>
            </section>

            <section className="mentoring-review-teaser">
              <div>
                <span className="section-label en-title">Mentoring Reviews</span>
                <h3>멘토링 후기</h3>
                <p>브랜딩, 판로, 지원사업 상담을 받은 회원사들의 실제 후기를 확인합니다.</p>
              </div>
              <Link href="/mentoring-day/reviews" className="service-action-btn">
                후기 페이지 보기
              </Link>
            </section>
          </>
        )}

        {slug === 'sero-shop' && (
          <section className="action-grid wide-left shop-commerce-grid">
            <div className="service-panel shop-product-panel">
              <h3>회원사 상품</h3>
              <div className="product-grid">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="shop-product-card"
                    role="button"
                    tabIndex={0}
                    aria-label={`${product.name} 장바구니 담기`}
                    onClick={() => setCart([...cart, product])}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setCart([...cart, product]);
                      }
                    }}
                  >
                    <div className="shop-product-image">
                      <img src={product.imageUrl} alt={`${product.name} 상품 이미지`} />
                    </div>
                    <strong>{product.name}</strong>
                    <div className="shop-price-stack">
                      {product.originalPrice && (
                        <span className="shop-original-price">{product.originalPrice.toLocaleString()}원</span>
                      )}
                      <span className="shop-current-price">{product.price.toLocaleString()}원</span>
                      {product.discount && <span className="shop-discount">{product.discount}%</span>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="service-panel">
              <h3>간이 장바구니</h3>
              <p>{cart.length}개 상품 · 합계 {cartTotal.toLocaleString()}원</p>
              <form className="service-form compact" onSubmit={(event) => submitLocalForm(event, 'sero-shop', '판매 상품 등록 신청이 저장되었습니다.')}>
                <input value={formState.product || ''} onChange={(e) => updateField('product', e.target.value)} placeholder="판매 등록할 상품명" />
                <button type="submit">상품 등록 신청</button>
              </form>
              {submitted && <span className="form-result">{submitted}</span>}
            </div>
          </section>
        )}

        {slug === 'sero-talk' && (
          <section className="action-grid wide-left">
            <div className="service-panel">
              <h3>세로 토크 게시판</h3>
              <div className="topic-list">
                {['자유 게시판', 'MOU 제안', '콜라보 프로젝트'].map((item) => (
                  <button key={item} type="button" className={talkType === item ? 'active' : ''} onClick={() => setTalkType(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="mini-list">
                {talkPosts.filter((post) => post.type === talkType).map((post) => (
                  <article key={post.id}>
                    <strong>{post.title}</strong>
                    <span>{post.type} · {post.author}</span>
                  </article>
                ))}
              </div>
            </div>
            <form className="service-panel service-form" onSubmit={createTalkPost}>
              <h3>{talkType} 글쓰기</h3>
              <input required value={formState.title || ''} onChange={(e) => updateField('title', e.target.value)} placeholder="제목" />
              <input value={formState.author || ''} onChange={(e) => updateField('author', e.target.value)} placeholder="작성자/브랜드명" />
              <textarea value={formState.content || ''} onChange={(e) => updateField('content', e.target.value)} placeholder="내용" />
              <button type="submit">글 등록하기</button>
              {submitted && <span className="form-result">{submitted}</span>}
            </form>
          </section>
        )}
      </main>

      <style jsx>{`
        .service-hero-inner {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .service-hero-kicker-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        }

        .service-post-count {
          color: #b7b7b7;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
        }

        .service-main {
          padding: 38px 20px 96px;
        }

        .service-overview {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 24px;
          margin-bottom: 34px;
        }

        .service-copy h2 {
          max-width: 760px;
          font-size: 30px;
          line-height: 1.32;
          font-weight: 900;
          letter-spacing: 0;
          word-break: keep-all;
          color: var(--color-charcoal-deep);
        }

        .service-copy p {
          margin-top: 12px;
          max-width: 660px;
          font-size: 15px;
          line-height: 1.7;
          color: var(--color-gray-dark);
        }

        .action-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .service-panel {
          background: var(--color-white);
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-subtle);
        }

        .service-panel {
          padding: 26px;
        }

        .service-panel h3 {
          font-size: 20px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin-bottom: 14px;
        }

        .service-panel p,
        .mini-list p {
          font-size: 14px;
          line-height: 1.65;
          color: var(--color-gray-dark);
        }

        .service-action-btn,
        .service-form button {
          min-height: 44px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--color-button-solid);
          color: var(--color-white);
          font-size: 14px;
          font-weight: 900;
          border-radius: 0;
          margin-top: 18px;
        }

        .service-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .service-form.compact {
          margin-top: 18px;
        }

        .service-form input,
        .service-form select,
        .service-form textarea {
          width: 100%;
          min-height: 44px;
          padding: 11px 12px;
          border: 1px solid var(--color-gray-light);
          background: var(--color-sand-light);
          color: var(--color-charcoal-deep);
          font: inherit;
          font-size: 14px;
          font-weight: 700;
        }

        .service-form textarea {
          min-height: 108px;
          resize: vertical;
          line-height: 1.55;
        }

        .form-result {
          font-size: 13px;
          font-weight: 900;
          color: var(--color-emerald-deep);
        }

        .mini-list,
        .content-card-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mini-list article,
        .content-card-list article {
          padding: 18px;
          background: var(--color-sand-light);
          border: 1px solid var(--color-gray-light);
        }

        .mini-list strong,
        .content-card-list strong {
          display: block;
          font-size: 15px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin-bottom: 6px;
        }

        .mini-list span,
        .content-card-list span {
          display: block;
          font-size: 12px;
          font-weight: 900;
          color: var(--color-orange-accent);
          margin-bottom: 6px;
        }

        .topic-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .topic-list span,
        .topic-list button {
          min-height: 34px;
          padding: 0 12px;
          background: var(--brand-soft);
          color: var(--color-emerald-deep);
          font-size: 13px;
          font-weight: 900;
        }

        .topic-list button.active {
          background: var(--color-button-solid);
          color: var(--color-white);
        }

        .mentoring-review-teaser {
          margin-top: 18px;
          padding: 30px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 22px;
          background: #111111;
          color: var(--color-white);
        }

        .mentoring-review-teaser h3 {
          color: var(--color-white);
          font-family: var(--font-family-condensed);
          font-size: clamp(30px, 4vw, 52px);
          font-weight: 900;
          line-height: 1.05;
          margin-bottom: 12px;
        }

        .mentoring-review-teaser p {
          max-width: 620px;
          color: #d7d7d7;
          font-size: 15px;
          line-height: 1.7;
        }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 42px 28px;
        }

        .shop-product-panel {
          padding: 0;
          background: transparent;
          border: 0;
          box-shadow: none;
        }

        .shop-product-panel h3 {
          margin-bottom: 24px;
        }

        .shop-product-card {
          min-width: 0;
          cursor: pointer;
          outline: none;
        }

        .shop-product-card:focus-visible .shop-product-image,
        .shop-product-card:hover .shop-product-image {
          border-color: var(--color-orange-accent);
        }

        .shop-product-card:focus-visible img,
        .shop-product-card:hover img {
          transform: scale(1.025);
        }

        .shop-product-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--color-sand-light);
          border: 1px solid transparent;
          transition: border-color 0.2s ease;
        }

        .shop-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .shop-product-card strong {
          display: block;
          margin-top: 18px;
          color: var(--color-charcoal-deep);
          font-size: clamp(20px, 2vw, 28px);
          font-weight: 900;
          line-height: 1.35;
          word-break: keep-all;
        }

        .shop-price-stack {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 7px;
          margin-top: 20px;
          color: var(--color-charcoal-deep);
          font-weight: 900;
        }

        .shop-original-price {
          color: #9a9a9a;
          font-size: 18px;
          text-decoration: line-through;
        }

        .shop-current-price {
          color: var(--color-charcoal-deep);
          font-size: 22px;
        }

        .shop-discount {
          color: #8a735f;
          font-size: 18px;
        }

        .member-editorial {
          padding-bottom: 72px;
        }

        .member-filter-list {
          padding-bottom: 34px;
          border-bottom: 1px solid var(--color-gray-light);
          margin-bottom: 26px;
        }

        .member-filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .member-filter-buttons button {
          min-height: 44px;
          padding: 0 16px;
          border: 1px solid var(--color-gray-light);
          background: var(--color-white);
          color: #9b9b9b;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0;
        }

        .member-filter-buttons button.active {
          border-color: var(--color-charcoal-deep);
          background: var(--color-charcoal-deep);
          color: var(--color-white);
        }

        .member-sort-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 34px;
        }

        .member-sort-row > span {
          color: var(--color-gray-dark);
          font-size: 13px;
          font-weight: 900;
        }

        .member-sort-row div {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .member-sort-row button {
          color: #b8b8b8;
          font-size: 16px;
          font-weight: 900;
        }

        .member-sort-row button.active {
          color: var(--color-charcoal-deep);
        }

        .member-sort-row i {
          width: 1px;
          height: 18px;
          background: var(--color-gray-light);
        }

        .member-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 44px;
        }

        .member-content-card {
          display: flex;
          flex-direction: column;
        }

        .member-card-image {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--color-sand-light);
        }

        .member-card-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 220ms ease;
        }

        .member-content-card:hover .member-card-image img {
          transform: scale(1.035);
        }

        .member-card-image span {
          position: absolute;
          top: 16px;
          left: 16px;
          min-height: 34px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.82);
          background: rgba(24, 22, 20, 0.32);
          color: var(--color-white);
          font-size: 12px;
          font-weight: 900;
        }

        .member-card-copy {
          padding-top: 18px;
        }

        .member-card-copy strong {
          display: block;
          color: var(--color-charcoal-deep);
          font-size: 24px;
          font-weight: 900;
          line-height: 1.36;
          letter-spacing: 0;
          word-break: keep-all;
        }

        .member-card-copy p {
          margin-top: 10px;
          color: var(--color-charcoal-deep);
          font-size: 16px;
          line-height: 1.65;
          font-weight: 700;
          word-break: keep-all;
        }

        .member-card-copy span {
          display: block;
          margin-top: 14px;
          color: var(--color-gray-dark);
          font-size: 13px;
          font-weight: 900;
        }

        @media (min-width: 768px) {
          .service-overview {
            grid-template-columns: minmax(0, 1fr);
            align-items: start;
          }

          .action-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .action-grid.wide-left {
            grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
          }

          .action-grid.wide-left.shop-commerce-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .member-content-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            align-items: stretch;
            gap: 64px 32px;
          }

          .member-filter-buttons button {
            min-height: 54px;
            padding: 0 18px;
            font-size: 18px;
          }

          .member-card-copy strong {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
}
