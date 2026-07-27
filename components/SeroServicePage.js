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
  { brand: '밀마루 베이커리', type: 'Interview', title: '쌀빵으로 세종의 아침을 굽는 방법', channel: 'YouTube · Reels' },
  { brand: '공방 세종', type: 'Shorts', title: '흙과 도시가 만나는 로컬 공예 루틴', channel: 'Instagram · Shorts' },
  { brand: '조치원 브루어리', type: 'Story', title: '100년 양조장에 새 브랜드를 입히다', channel: 'Blog · YouTube' }
];

const products = [
  { id: 'rice-bread', name: '세종 쌀식빵 세트', brand: '밀마루 베이커리', price: 24000, category: 'F&B' },
  { id: 'ceramic-cup', name: '로컬 흙 머그컵', brand: '공방 세종', price: 32000, category: 'Craft' },
  { id: 'peach-jam', name: '조치원 복숭아잼 2종', brand: '디저트 카페 도원', price: 18000, category: 'F&B' }
];

const supportPrograms = [
  '소상공인 로컬브랜드 창출 지원사업',
  '세종 청년창업 성장 패키지',
  '로컬 크리에이터 협업 프로젝트 지원',
  '중소기업 온라인 판로 지원사업'
];

const initialTalkPosts = [
  { id: 1, type: '자유 게시판', title: '8월 팝업 행사 같이 나갈 F&B 브랜드를 찾습니다.', author: '도원' },
  { id: 2, type: 'MOU 제안', title: '대학 창업동아리와 회원사 현장실습 연계를 제안합니다.', author: '운영팀' },
  { id: 3, type: '콜라보 프로젝트', title: '세종 복숭아 시즌 공동 패키지 프로젝트 모집', author: '브루어리' }
];

function saveItem(key, item) {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const previous = JSON.parse(localStorage.getItem(storageKey) || '[]');
  localStorage.setItem(storageKey, JSON.stringify([item, ...previous]));
}

export default function SeroServicePage({ slug }) {
  const category = getServiceCategory(slug);
  const [formState, setFormState] = useState({});
  const [submitted, setSubmitted] = useState('');
  const [cart, setCart] = useState([]);
  const [talkPosts, setTalkPosts] = useState(initialTalkPosts);
  const [talkType, setTalkType] = useState('자유 게시판');
  const [aiDraft, setAiDraft] = useState(null);

  const cartTotal = useMemo(() => (
    cart.reduce((sum, item) => sum + item.price, 0)
  ), [cart]);

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

  const generateAiDraft = (event) => {
    event.preventDefault();
    const company = formState.company || '우리 기업';
    const item = formState.item || '대표 상품';
    const target = formState.target || '세종 지역 고객';
    const issue = formState.issue || '판로 확대와 브랜드 인지도 향상';

    setAiDraft({
      summary: `${company}은 ${item}을 중심으로 ${target}에게 로컬 기반의 차별화된 가치를 제공하는 기업입니다.`,
      problem: `${target}은 신뢰할 수 있는 지역 상품과 브랜드 스토리를 발견하기 어렵고, ${issue} 과제가 남아 있습니다.`,
      solution: `${company}은 협회 아카이브, 세로 쇼핑, 세로 데이 네트워킹을 활용해 상품 경험과 브랜드 콘텐츠를 함께 확산합니다.`,
      roadmap: ['1개월: 브랜드/상품 정보 정리', '2개월: SNS 콘텐츠와 상세페이지 제작', '3개월: 지원사업 신청 및 협업 프로젝트 추진'],
      programs: supportPrograms
    });
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
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>
            {category.eyebrow}
          </span>
          <h1 className="page-hero-title">{category.title}</h1>
          <p className="page-hero-desc">{category.description}</p>
        </div>
      </section>

      <main className="container service-main">
        <nav className="service-category-strip" aria-label="세로 서비스 카테고리">
          {SERVICE_CATEGORIES.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className={`service-chip ${item.slug === category.slug ? 'active' : ''}`}
            >
              <span>{item.number}</span>
              {item.shortTitle}
            </Link>
          ))}
        </nav>

        <section className="service-overview">
          <div className="service-copy">
            <span className="section-label en-title">Service Topic</span>
            <h2>{category.topics.join(' · ')}</h2>
            <p>이 카테고리에서 바로 필요한 업무를 시작할 수 있도록 신청, 작성, 저장, 추천 기능을 함께 구성했습니다.</p>
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
            <div className="service-panel">
              <h3>회원사 콘텐츠 큐레이션</h3>
              <div className="content-card-list">
                {memberContents.map((item) => (
                  <article key={item.title}>
                    <span>{item.type}</span>
                    <strong>{item.title}</strong>
                    <p>{item.brand} · {item.channel}</p>
                  </article>
                ))}
              </div>
            </div>
            <form className="service-panel service-form" onSubmit={(event) => submitLocalForm(event, 'sero-members', '회원사 콘텐츠 제보가 저장되었습니다.')}>
              <h3>인터뷰/SNS 콘텐츠 제보</h3>
              <input required value={formState.brand || ''} onChange={(e) => updateField('brand', e.target.value)} placeholder="회원사명" />
              <input value={formState.url || ''} onChange={(e) => updateField('url', e.target.value)} placeholder="영상 또는 SNS 링크" />
              <textarea required value={formState.story || ''} onChange={(e) => updateField('story', e.target.value)} placeholder="소개하고 싶은 브랜드 이야기" />
              <button type="submit">콘텐츠 제보하기</button>
              {submitted && <span className="form-result">{submitted}</span>}
            </form>
          </section>
        )}

        {slug === 'sero-ai-start' && (
          <section className="action-grid wide-left">
            <form className="service-panel service-form" onSubmit={generateAiDraft}>
              <h3>AI 사업계획서 초안 생성</h3>
              <input required value={formState.company || ''} onChange={(e) => updateField('company', e.target.value)} placeholder="기업명" />
              <input required value={formState.item || ''} onChange={(e) => updateField('item', e.target.value)} placeholder="대표 상품/서비스" />
              <input value={formState.target || ''} onChange={(e) => updateField('target', e.target.value)} placeholder="주요 고객" />
              <textarea value={formState.issue || ''} onChange={(e) => updateField('issue', e.target.value)} placeholder="현재 해결하고 싶은 문제" />
              <button type="submit">초안 생성하기</button>
            </form>
            <div className="service-panel ai-result">
              <h3>생성 결과</h3>
              {aiDraft ? (
                <>
                  <strong>사업 요약</strong>
                  <p>{aiDraft.summary}</p>
                  <strong>문제 정의</strong>
                  <p>{aiDraft.problem}</p>
                  <strong>해결 전략</strong>
                  <p>{aiDraft.solution}</p>
                  <strong>실행 로드맵</strong>
                  <ul>{aiDraft.roadmap.map((item) => <li key={item}>{item}</li>)}</ul>
                  <strong>추천 지원사업</strong>
                  <ul>{aiDraft.programs.map((item) => <li key={item}>{item}</li>)}</ul>
                </>
              ) : (
                <p>기업 정보를 입력하면 사업계획서 초안과 추천 지원사업이 이곳에 표시됩니다.</p>
              )}
            </div>
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
        .service-main {
          padding: 38px 20px 96px;
        }

        .service-category-strip {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 14px;
          margin-bottom: 34px;
          border-bottom: 1px solid var(--color-gray-light);
        }

        .service-chip {
          flex: 0 0 auto;
          min-height: 42px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--color-gray-light);
          color: var(--color-gray-dark);
          background: var(--color-white);
          font-size: 13px;
          font-weight: 900;
        }

        .service-chip span {
          color: var(--color-orange-accent);
        }

        .service-chip.active {
          background: var(--color-button-solid);
          border-color: var(--color-button-solid);
          color: var(--color-white);
        }

        .service-chip.active span {
          color: var(--color-white);
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
          background: var(--brand-gradient-soft);
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
          background: var(--brand-gradient-soft);
          color: var(--color-emerald-deep);
          font-size: 13px;
          font-weight: 900;
        }

        .topic-list button.active {
          background: var(--color-button-solid);
          color: var(--color-white);
        }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .ai-result strong {
          display: block;
          margin-top: 14px;
          margin-bottom: 6px;
          color: var(--color-emerald-deep);
        }

        .ai-result ul {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin: 6px 0 0;
          padding-left: 18px;
          list-style: disc;
          color: var(--color-gray-dark);
          font-size: 14px;
          line-height: 1.55;
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
        }
      `}</style>
    </div>
  );
}
