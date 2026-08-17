'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SERVICE_CATEGORIES, getServiceCategory } from '@/lib/serviceCategories';

const STORAGE_PREFIX = 'sejong_sero_service_';

const scheduleItems = [
  { title: '제18회 세로 데이', meta: '2026.08.28 · 나성동 로컬허브', desc: '회원사 3분 브랜드 소개, 업종별 라운드테이블, 협업 매칭 네트워킹' },
  { title: '제19회 세로 데이', meta: '2026.09.25 · 조치원 청년창업거리', desc: '원도심 상권 협업, 팝업 운영 경험 공유, 현장 투어' },
  { title: '제20회 세로 데이', meta: '2026.10.30 · 세종창조경제혁신센터', desc: '투자/지원사업 발표 피칭과 공공기관 네트워킹' }
];

const memberContents = [
  {
    id: 'member-milmaru',
    brand: '밀마루 베이커리',
    type: '인터뷰 영상',
    title: '쌀빵으로 세종의 아침을 굽는 방법',
    channel: 'YouTube',
    url: 'https://www.youtube.com/',
    story: '세종 쌀로 만든 쌀식빵과 친환경 효모종을 연구하는 로컬 베이커리 이야기입니다.',
    mediaKind: 'video'
  },
  {
    id: 'member-dowon',
    brand: '디저트 카페 도원',
    type: '인터뷰 영상',
    title: '조치원 복숭아로 계절 디저트를 만드는 법',
    channel: 'YouTube',
    url: 'https://www.youtube.com/',
    story: '지역 농가와 협업해 복숭아잼, 타르트, 선물세트를 만드는 카페 운영 스토리입니다.',
    mediaKind: 'video'
  },
  {
    id: 'member-craft',
    brand: '공방 세종',
    type: 'Instagram Reels',
    title: '흙과 도시가 만나는 로컬 공예 루틴',
    channel: 'Instagram',
    url: 'https://www.instagram.com/reels/',
    story: '제작 과정과 작업실 풍경을 짧은 릴스 콘텐츠로 소개합니다.',
    mediaKind: 'instagram'
  },
  {
    id: 'member-studio',
    brand: '세종 프린트 스튜디오',
    type: 'Instagram Reels',
    title: '로컬 브랜드 패키지를 인쇄하는 하루',
    channel: 'Instagram',
    url: 'https://www.instagram.com/reels/',
    story: '명함, 라벨, 패키지 샘플이 완성되는 작업 과정을 릴스로 보여주는 콘텐츠입니다.',
    mediaKind: 'instagram'
  },
  {
    id: 'member-brewery',
    brand: '조치원 브루어리',
    type: 'Instagram 게시물',
    title: '100년 양조장에 새 브랜드를 입히다',
    channel: 'Instagram',
    url: 'https://www.instagram.com/',
    story: '오래된 지역 자산을 현대적인 브랜드 경험으로 다시 연결하는 사례입니다.',
    mediaKind: 'instagram'
  },
  {
    id: 'member-stay',
    brand: '스테이 금강',
    type: 'Instagram 게시물',
    title: '숙박 공간에서 지역 상품을 큐레이션하는 방식',
    channel: 'Instagram',
    url: 'https://www.instagram.com/',
    story: '객실 안에서 세종 로컬 상품을 경험하고 구매로 이어지게 만드는 공간 콘텐츠입니다.',
    mediaKind: 'instagram'
  },
  {
    id: 'member-flower',
    brand: '나성 플라워랩',
    type: '브랜드 필름',
    title: '행사 꽃 장식에서 로컬 클래스까지 확장하기',
    channel: 'YouTube · Instagram',
    url: 'https://www.youtube.com/',
    story: '기업 행사, 원데이 클래스, 정기 구독 서비스를 연결하는 플라워 브랜드 이야기입니다.',
    mediaKind: 'video'
  }
];

const memberContentFilters = ['전체', '인터뷰 영상', '브랜드 필름', 'Instagram Reels', 'Instagram 게시물'];

const products = [
  { id: 'rice-bread', name: '세종 쌀식빵 세트', brand: '밀마루 베이커리', price: 24000, category: 'F&B' },
  { id: 'ceramic-cup', name: '로컬 흙 머그컵', brand: '공방 세종', price: 32000, category: 'Craft' },
  { id: 'peach-jam', name: '조치원 복숭아잼 2종', brand: '디저트 카페 도원', price: 18000, category: 'F&B' }
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

  const cartTotal = useMemo(() => (
    cart.reduce((sum, item) => sum + item.price, 0)
  ), [cart]);

  const filteredMemberContents = useMemo(() => {
    if (memberFilter === '전체') {
      return memberContents;
    }

    return memberContents.filter((item) => item.type === memberFilter);
  }, [memberFilter]);

  const servicePostCount = useMemo(() => {
    const counts = {
      notice: 2,
      'sero-day': scheduleItems.length,
      'sero-members': memberContents.length,
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
        <section className="service-overview">
          <div className="service-copy">
            <span className="section-label en-title">Service Topic</span>
            <h2>{category.topics.join(' · ')}</h2>
            <p>
              {slug === 'sero-members'
                ? '회원사의 인터뷰 영상, 릴스, 게시물 콘텐츠를 한눈에 탐색할 수 있도록 정리했습니다.'
                : '이 카테고리에서 바로 필요한 업무를 시작할 수 있도록 신청, 작성, 저장, 추천 기능을 함께 구성했습니다.'}
            </p>
          </div>

          <div className="feature-grid">
            {category.features.map((feature) => (
              <div key={feature} className="feature-card">
                <span>✓</span>
                <strong>{feature}</strong>
              </div>
            ))}
          </div>
        </section>

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
          <section className="action-grid">
            <div className="service-panel member-content-panel">
              <div className="panel-heading-row">
                <h3>회원사 콘텐츠</h3>
                <span>{filteredMemberContents.length}개 콘텐츠</span>
              </div>
              <div className="topic-list member-filter-list">
                {memberContentFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={memberFilter === filter ? 'active' : ''}
                    onClick={() => setMemberFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="content-card-list">
                {filteredMemberContents.map((item) => (
                  <article key={item.id || item.title}>
                    <span>{item.type}</span>
                    <strong>{item.title}</strong>
                    <p>{item.brand} · {item.channel}</p>
                    <p className="member-story">{item.story}</p>
                    <a className="member-link-preview" href={item.url} target="_blank" rel="noreferrer">
                      {item.mediaKind === 'instagram' ? 'Instagram에서 보기 ↗' : '콘텐츠 보기 ↗'}
                    </a>
                  </article>
                ))}
              </div>
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
        )}

        {slug === 'sero-shop' && (
          <section className="action-grid wide-left">
            <div className="service-panel">
              <h3>회원사 상품</h3>
              <div className="product-grid">
                {products.map((product) => (
                  <article key={product.id}>
                    <span>{product.category}</span>
                    <strong>{product.name}</strong>
                    <p>{product.brand}</p>
                    <button type="button" onClick={() => setCart([...cart, product])}>
                      {product.price.toLocaleString()}원 담기
                    </button>
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

        .feature-grid,
        .action-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .feature-card,
        .service-panel {
          background: var(--color-white);
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-subtle);
        }

        .feature-card {
          min-height: 72px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-card span {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--brand-soft);
          color: var(--color-emerald-deep);
          border-radius: 50%;
          font-weight: 900;
        }

        .feature-card strong {
          font-size: 14px;
          line-height: 1.45;
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

        .panel-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .panel-heading-row h3 {
          margin-bottom: 0;
        }

        .panel-heading-row span {
          color: var(--color-gray-dark);
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
        }

        .service-panel p,
        .mini-list p {
          font-size: 14px;
          line-height: 1.65;
          color: var(--color-gray-dark);
        }

        .service-action-btn,
        .service-form button,
        .product-grid button {
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
        .content-card-list article,
        .product-grid article {
          padding: 18px;
          background: var(--color-sand-light);
          border: 1px solid var(--color-gray-light);
        }

        .mini-list strong,
        .content-card-list strong,
        .product-grid strong {
          display: block;
          font-size: 15px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin-bottom: 6px;
        }

        .mini-list span,
        .content-card-list span,
        .product-grid span {
          display: block;
          font-size: 12px;
          font-weight: 900;
          color: var(--color-orange-accent);
          margin-bottom: 6px;
        }

        .member-link-preview {
          min-height: 34px;
          margin: 10px 0;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-charcoal-deep);
          color: var(--color-charcoal-deep);
          font-size: 12px;
          font-weight: 900;
        }

        .member-story {
          margin-top: 8px;
        }

        .member-content-panel {
          grid-column: 1 / -1;
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

        .member-filter-list {
          margin-bottom: 20px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 768px) {
          .service-overview {
            grid-template-columns: minmax(0, 1fr) 420px;
            align-items: start;
          }

          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .action-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .action-grid.wide-left {
            grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
          }

          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .member-content-panel .content-card-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
