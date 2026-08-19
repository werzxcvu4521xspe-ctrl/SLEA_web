'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { MEMBER_CONTENT_FILTERS, MEMBER_CONTENTS } from '@/lib/memberContents';
import { SERVICE_CATEGORIES, getServiceCategory } from '@/lib/serviceCategories';

const STORAGE_PREFIX = 'sejong_sero_service_';

const seroDayPrograms = [
  {
    id: 'sero-day-network-18',
    title: '제18회 세로 데이: 로컬 브랜드 네트워킹',
    type: '네트워킹',
    status: '접수중',
    date: '2026.08.28 금요일 19:00',
    place: '나성동 로컬허브',
    capacity: '30명',
    imageUrl: 'https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=1200&auto=format&fit=crop',
    summary: '회원사 3분 브랜드 소개와 업종별 라운드테이블로 서로의 고객, 채널, 자원을 연결합니다.',
    description: '세종 로컬 창업가들이 한자리에 모여 브랜드를 소개하고 협업 가능성을 찾는 정기 네트워킹 프로그램입니다. 참여자는 짧은 브랜드 소개, 그룹별 대화, 협업 제안 시간을 통해 바로 실행 가능한 연결 지점을 정리합니다.'
  },
  {
    id: 'sero-day-market-tour',
    title: '원도심 상권 협업 투어',
    type: '현장 투어',
    status: '접수중',
    date: '2026.09.12 토요일 14:00',
    place: '조치원 청년창업거리',
    capacity: '20명',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    summary: '원도심 공간과 브랜드를 함께 둘러보고 팝업, 공동 프로모션, 콘텐츠 협업 아이디어를 찾습니다.',
    description: '조치원 원도심의 창업 공간과 로컬 브랜드를 직접 방문하며 현장에서 협업 가능성을 발굴합니다. 상권 운영자, 공간 운영자, 회원 브랜드가 함께 참여해 팝업 운영과 지역 캠페인 아이디어를 구체화합니다.'
  },
  {
    id: 'sero-day-pop-up',
    title: '가을 팝업마켓 참여 브랜드 모집',
    type: '팝업마켓',
    status: '접수중',
    date: '2026.09.25 금요일 17:00',
    place: '세종 중앙공원',
    capacity: '12팀',
    imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1200&auto=format&fit=crop',
    summary: '회원사 상품을 시민에게 소개하는 팝업마켓 운영 설명회와 참가 브랜드 매칭을 진행합니다.',
    description: '가을 시즌 공동 팝업마켓을 준비하는 회원사를 위한 사전 설명 프로그램입니다. 부스 구성, 판매 운영, 공동 홍보 방식, 결제/정산 안내를 공유하고 참가 브랜드 간 교차 판매 아이디어를 정리합니다.'
  },
  {
    id: 'sero-day-pitching',
    title: '지원사업 피칭 리허설 데이',
    type: '피칭',
    status: '접수 예정',
    date: '2026.10.30 금요일 18:30',
    place: '세종창조경제혁신센터',
    capacity: '15팀',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop',
    summary: '정부지원사업 발표를 앞둔 회원사를 위해 사업계획서 핵심 메시지와 발표 흐름을 점검합니다.',
    description: '지원사업 발표와 투자 미팅을 준비하는 회원사를 위한 피칭 리허설 프로그램입니다. 사업 소개, 시장 문제, 수익 모델, 실행 계획을 짧은 발표로 정리하고 운영진과 동료 창업가의 피드백을 받습니다.'
  }
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
  const [seroDayFilter, setSeroDayFilter] = useState('전체');
  const [selectedSeroProgramId, setSelectedSeroProgramId] = useState(seroDayPrograms[0].id);
  const [activeSeroProgram, setActiveSeroProgram] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const seroDayFilters = useMemo(() => (
    ['전체', ...Array.from(new Set(seroDayPrograms.map((program) => program.type)))]
  ), []);

  const filteredSeroDayPrograms = useMemo(() => (
    seroDayFilter === '전체'
      ? seroDayPrograms
      : seroDayPrograms.filter((program) => program.type === seroDayFilter)
  ), [seroDayFilter]);

  const selectedSeroProgram = useMemo(() => (
    seroDayPrograms.find((program) => program.id === selectedSeroProgramId) || seroDayPrograms[0]
  ), [selectedSeroProgramId]);

  const servicePostCount = useMemo(() => {
    const counts = {
      notice: 2,
      'sero-day': seroDayPrograms.length,
      'sero-members': MEMBER_CONTENTS.length,
      'sero-ai-start': 0,
      'mentoring-day': 0,
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
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
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

  const submitSeroDayApplication = (event) => {
    event.preventDefault();
    const item = {
      id: `sero-day-${Date.now()}`,
      programId: selectedSeroProgram.id,
      programTitle: selectedSeroProgram.title,
      programDate: selectedSeroProgram.date,
      programPlace: selectedSeroProgram.place,
      ...formState,
      createdAt: new Date().toISOString()
    };
    saveItem('sero-day', item);
    setSubmitted(`${selectedSeroProgram.title} 신청이 저장되었습니다.`);
    setFormState({});
    window.setTimeout(() => setSubmitted(''), 2600);
  };

  return (
    <div className="sero-service-page">
      <section className="page-hero-banner">
        <div className="container service-hero-inner">
          <div className="service-hero-kicker-row">
            <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>
              {category.eyebrow}
            </span>
            {servicePostCount > 0 && <span className="service-post-count">{servicePostCount} posts</span>}
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
          <section className="sero-program-section">
            <div className="member-filter-list sero-program-filter">
              <div className="member-filter-buttons">
                {seroDayFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={seroDayFilter === filter ? 'active' : ''}
                    onClick={() => setSeroDayFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="sero-program-layout">
              <div className="sero-program-content">
                <div className="member-sort-row">
                  <span>{filteredSeroDayPrograms.length} programs</span>
                  <div>
                    <button type="button" className="active">신청 가능</button>
                    <i aria-hidden="true" />
                    <button type="button">최신 일정</button>
                  </div>
                </div>

                <div className="sero-program-grid">
                  {filteredSeroDayPrograms.map((program) => (
                    <article key={program.id} className="sero-program-card">
                      <button type="button" className="sero-program-image" onClick={() => setActiveSeroProgram(program)}>
                        <img src={program.imageUrl} alt={program.title} loading="lazy" />
                        <span>{program.type}</span>
                      </button>
                      <div className="sero-program-copy">
                        <button type="button" onClick={() => setActiveSeroProgram(program)}>
                          {program.title}
                        </button>
                        <p>{program.summary}</p>
                        <div className="sero-program-meta">
                          <span>{program.date}</span>
                          <span>{program.place}</span>
                          <span>정원 {program.capacity}</span>
                        </div>
                        <div className="sero-program-actions">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSeroProgramId(program.id);
                              setFormState((prev) => ({ ...prev, programId: program.id }));
                            }}
                          >
                            신청 선택하기 →
                          </button>
                          <span className={program.status === '접수중' ? 'open' : 'upcoming'}>
                            {program.status}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <form className="sero-application-panel service-form" onSubmit={submitSeroDayApplication}>
                <div className="application-heading">
                  <span>Program Application</span>
                  <h3>프로그램 신청</h3>
                </div>

                <label>
                  <span>신청 프로그램 *</span>
                  <select
                    required
                    value={selectedSeroProgramId}
                    onChange={(e) => setSelectedSeroProgramId(e.target.value)}
                  >
                    {seroDayPrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        [{program.type}] {program.title}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="selected-program-summary">
                  <strong>{selectedSeroProgram.title}</strong>
                  <span>{selectedSeroProgram.date}</span>
                  <p>{selectedSeroProgram.place} · 정원 {selectedSeroProgram.capacity}</p>
                </div>

                <div className="form-two-col">
                  <label>
                    <span>신청자명 *</span>
                    <input required value={formState.name || ''} onChange={(e) => updateField('name', e.target.value)} placeholder="예: 홍길동" />
                  </label>
                  <label>
                    <span>연락처 *</span>
                    <input required type="tel" value={formState.phone || ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="010-0000-0000" />
                  </label>
                </div>

                <label>
                  <span>브랜드/기업명 *</span>
                  <input required value={formState.brand || ''} onChange={(e) => updateField('brand', e.target.value)} placeholder="브랜드 또는 기업명" />
                </label>

                <label>
                  <span>참여 인원 *</span>
                  <input required type="number" min="1" max="10" value={formState.participants || '1'} onChange={(e) => updateField('participants', e.target.value)} />
                </label>

                <label>
                  <span>만나고 싶은 분야 / 협업 관심사</span>
                  <textarea value={formState.interest || ''} onChange={(e) => updateField('interest', e.target.value)} placeholder="예: F&B 브랜드와 공동 팝업을 논의하고 싶어요." />
                </label>

                <label className="consent-check">
                  <input
                    type="checkbox"
                    required
                    checked={Boolean(formState.consent)}
                    onChange={(e) => updateField('consent', e.target.checked)}
                  />
                  <span>신청 안내를 위해 이름과 연락처를 수집하는 것에 동의합니다.</span>
                </label>

                <button type="submit" disabled={selectedSeroProgram.status !== '접수중'}>
                  {selectedSeroProgram.status === '접수중' ? '프로그램 신청 저장' : '접수 예정입니다'}
                </button>
                {submitted && <span className="form-result">{submitted}</span>}
              </form>
            </div>

            {activeSeroProgram && (
              <div className="program-modal-backdrop" onClick={() => setActiveSeroProgram(null)}>
                <div className="program-modal" onClick={(event) => event.stopPropagation()}>
                  <button type="button" className="modal-close" onClick={() => setActiveSeroProgram(null)}>Close</button>
                  <div className="program-modal-image">
                    <img src={activeSeroProgram.imageUrl} alt={activeSeroProgram.title} />
                  </div>
                  <div className="program-modal-copy">
                    <span>{activeSeroProgram.type} / {activeSeroProgram.status}</span>
                    <h3>{activeSeroProgram.title}</h3>
                    <dl>
                      <div>
                        <dt>일시</dt>
                        <dd>{activeSeroProgram.date}</dd>
                      </div>
                      <div>
                        <dt>장소</dt>
                        <dd>{activeSeroProgram.place}</dd>
                      </div>
                      <div>
                        <dt>정원</dt>
                        <dd>{activeSeroProgram.capacity}</dd>
                      </div>
                    </dl>
                    <p>{activeSeroProgram.description}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSeroProgramId(activeSeroProgram.id);
                        setActiveSeroProgram(null);
                      }}
                    >
                      이 프로그램 신청하기 →
                    </button>
                  </div>
                </div>
              </div>
            )}
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
            {user ? (
              <form className="service-panel service-form" onSubmit={createTalkPost}>
                <h3>{talkType} 글쓰기</h3>
                <input required value={formState.title || ''} onChange={(e) => updateField('title', e.target.value)} placeholder="제목" />
                <input value={formState.author || ''} onChange={(e) => updateField('author', e.target.value)} placeholder="작성자/브랜드명" />
                <textarea value={formState.content || ''} onChange={(e) => updateField('content', e.target.value)} placeholder="내용" />
                <button type="submit">글 등록하기</button>
                {submitted && <span className="form-result">{submitted}</span>}
              </form>
            ) : (
              <div className="service-panel service-form" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '300px', textAlign: 'center' }}>
                <h3>{talkType} 글쓰기</h3>
                <p style={{ margin: '30px 0', color: 'var(--color-gray-dark)', fontSize: '14px', fontWeight: '700' }}>
                  로그인한 회원만 글을 작성할 수 있습니다.
                </p>
                <Link href="/login" className="auth-submit-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', width: '100%', maxWidth: '200px', height: '44px', borderRadius: '4px', background: 'var(--color-orange-accent)', color: '#fff', fontWeight: 'bold' }}>
                  로그인 하러가기
                </Link>
              </div>
            )}
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

        .sero-program-section {
          padding-bottom: 84px;
        }

        .sero-program-filter {
          margin-bottom: 30px;
        }

        .sero-program-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 44px;
          align-items: start;
        }

        .sero-program-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 52px 32px;
        }

        .sero-program-card {
          min-width: 0;
        }

        .sero-program-image {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--color-sand-light);
          cursor: pointer;
        }

        .sero-program-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 220ms ease;
        }

        .sero-program-card:hover .sero-program-image img {
          transform: scale(1.035);
        }

        .sero-program-image span {
          position: absolute;
          top: 16px;
          left: 16px;
          min-height: 34px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.85);
          background: rgba(24, 22, 20, 0.38);
          color: var(--color-white);
          font-size: 12px;
          font-weight: 900;
        }

        .sero-program-copy {
          padding-top: 18px;
        }

        .sero-program-copy > button {
          display: block;
          width: 100%;
          text-align: left;
          color: var(--color-charcoal-deep);
          font-size: 24px;
          font-weight: 900;
          line-height: 1.36;
          letter-spacing: 0;
          word-break: keep-all;
        }

        .sero-program-copy > button:hover {
          color: var(--color-orange-accent);
        }

        .sero-program-copy p {
          margin-top: 10px;
          color: var(--color-charcoal-deep);
          font-size: 16px;
          line-height: 1.65;
          font-weight: 700;
          word-break: keep-all;
        }

        .sero-program-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 14px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--color-gray-light);
        }

        .sero-program-meta span {
          color: var(--color-gray-dark);
          font-size: 13px;
          font-weight: 900;
        }

        .sero-program-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 18px;
        }

        .sero-program-actions button {
          color: var(--color-orange-accent);
          font-size: 14px;
          font-weight: 900;
          border-bottom: 2px solid transparent;
          padding-bottom: 3px;
        }

        .sero-program-actions button:hover {
          border-bottom-color: var(--color-orange-accent);
        }

        .sero-program-actions span {
          min-height: 28px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          background: #111;
          color: var(--color-white);
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .sero-program-actions span.upcoming {
          background: var(--color-gray-light);
          color: var(--color-gray-dark);
        }

        .sero-application-panel {
          position: sticky;
          top: 120px;
          padding: 28px;
          background: var(--color-white);
          border: 1px solid var(--color-gray-light);
          box-shadow: var(--shadow-subtle);
        }

        .application-heading {
          padding-bottom: 18px;
          border-bottom: 1px solid var(--color-gray-light);
          margin-bottom: 6px;
        }

        .application-heading span {
          color: var(--color-orange-accent);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .application-heading h3 {
          margin-top: 6px;
          margin-bottom: 0;
          font-size: 28px;
        }

        .sero-application-panel label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: var(--color-charcoal-deep);
          font-size: 13px;
          font-weight: 900;
        }

        .selected-program-summary {
          padding: 16px;
          background: var(--color-sand-light);
          border: 1px solid var(--color-gray-light);
        }

        .selected-program-summary strong,
        .selected-program-summary span,
        .selected-program-summary p {
          display: block;
        }

        .selected-program-summary strong {
          color: var(--color-charcoal-deep);
          font-size: 15px;
          font-weight: 900;
          line-height: 1.45;
        }

        .selected-program-summary span {
          margin-top: 8px;
          color: var(--color-orange-accent);
          font-size: 12px;
          font-weight: 900;
        }

        .selected-program-summary p {
          margin-top: 4px;
          color: var(--color-gray-dark);
          font-size: 13px;
          font-weight: 800;
        }

        .form-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .consent-check {
          flex-direction: row !important;
          align-items: flex-start;
          padding: 14px;
          background: var(--color-sand-light);
          border: 1px solid var(--color-gray-light);
          color: var(--color-gray-dark) !important;
          line-height: 1.55;
        }

        .consent-check input {
          width: 16px;
          min-height: 16px;
          margin-top: 2px;
          accent-color: var(--color-orange-accent);
        }

        .program-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px;
          background: rgba(17, 17, 17, 0.72);
        }

        .program-modal {
          position: relative;
          width: min(920px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          display: grid;
          grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.15fr);
          gap: 0;
          background: var(--color-white);
          border: 1px solid var(--color-gray-light);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 2;
          min-height: 42px;
          padding: 0 16px;
          background: rgba(17, 17, 17, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.45);
          color: var(--color-white);
          font-size: 13px;
          font-weight: 900;
        }

        .program-modal-image {
          min-height: 420px;
          background: var(--color-sand-light);
        }

        .program-modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .program-modal-copy {
          padding: 42px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .program-modal-copy > span {
          color: var(--color-orange-accent);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .program-modal-copy h3 {
          color: var(--color-charcoal-deep);
          font-size: clamp(28px, 3.4vw, 44px);
          font-weight: 900;
          line-height: 1.16;
          letter-spacing: 0;
          word-break: keep-all;
        }

        .program-modal-copy dl {
          display: grid;
          gap: 10px;
          padding: 18px 0;
          border-top: 1px solid var(--color-gray-light);
          border-bottom: 1px solid var(--color-gray-light);
        }

        .program-modal-copy dl div {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .program-modal-copy dt,
        .program-modal-copy dd {
          font-size: 13px;
          font-weight: 900;
        }

        .program-modal-copy dt {
          color: var(--color-gray-dark);
        }

        .program-modal-copy dd {
          color: var(--color-charcoal-deep);
          text-align: right;
        }

        .program-modal-copy p {
          color: var(--color-gray-dark);
          font-size: 15px;
          line-height: 1.8;
          font-weight: 700;
        }

        .program-modal-copy > button {
          min-height: 48px;
          align-self: flex-start;
          padding: 0 20px;
          background: var(--color-orange-accent);
          color: var(--color-white);
          font-size: 14px;
          font-weight: 900;
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

          .sero-program-layout {
            grid-template-columns: minmax(0, 1fr) minmax(320px, 0.42fr);
          }

          .sero-program-grid {
            grid-template-columns: repeat(2, 1fr);
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

        @media (min-width: 1180px) {
          .sero-program-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 767px) {
          .form-two-col,
          .program-modal {
            grid-template-columns: 1fr;
          }

          .sero-application-panel {
            position: static;
            padding: 22px;
          }

          .program-modal-image {
            min-height: 260px;
          }

          .program-modal-copy {
            padding: 28px 22px;
          }
        }
      `}</style>
    </div>
  );
}
