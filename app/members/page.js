'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const INITIAL_MEMBERS = [
  { id: 1, rep: '이민수', brand: '디저트 카페 도원', type: 'F&B', region: '조치원읍', collaboration: '로컬 농산물 수급 및 협동 메뉴 기획' },
  { id: 2, rep: '김유리', brand: '조치원 브루어리', type: 'Culture', region: '조치원읍', collaboration: '수제맥주 양조 및 복합문화 행사 기획' },
  { id: 3, rep: '박성주', brand: '한옥 찻집 단차', type: 'F&B', region: '금남면', collaboration: '차 문화 클래스 운영 및 전통 다구 연계' },
  { id: 4, rep: '정소민', brand: '공방 세종', type: 'Craft', region: '연서면', collaboration: '도자 식기 주문 제작 및 공예 플리마켓 셀러' },
  { id: 5, rep: '최준혁', brand: '로컬허브 나성', type: 'Space', region: '나성동', collaboration: '공유오피스 제휴 및 소규모 워크숍 대관' },
  { id: 6, rep: '황정민', brand: '밀마루 베이커리', type: 'F&B', region: '아름동', collaboration: '유기농 쌀빵 납품 및 베이킹 아카데미' },
  { id: 7, rep: '홍다은', brand: '세종 굿즈 팩토리', type: 'Goods', region: '나성동', collaboration: '로컬 브랜드 굿즈 디자인 및 패키지 제작' },
  { id: 8, rep: '강동원', brand: '로컬 투어 가이드', type: 'Education', region: '조치원읍', collaboration: '세종 로컬 문화 탐방 코스 및 역사 콘텐츠 제휴' }
];

function MembersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'register';
  const [activeTab, setActiveTab] = useState(tabParam);

  // Directory Search/Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [filteredMembers, setFilteredMembers] = useState(INITIAL_MEMBERS);

  // Form State
  const [formStep, setFormStep] = useState(1);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [collab, setCollab] = useState('');

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.push(`/members?tab=${tabName}`, { scroll: false });
  };

  // Run filtering
  useEffect(() => {
    let result = INITIAL_MEMBERS;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.rep.toLowerCase().includes(q) || 
        m.brand.toLowerCase().includes(q) || 
        m.collaboration.toLowerCase().includes(q)
      );
    }

    if (selectedType !== 'All') {
      result = result.filter(m => m.type === selectedType);
    }

    if (selectedRegion !== 'All') {
      result = result.filter(m => m.region === selectedRegion);
    }

    setFilteredMembers(result);
  }, [searchQuery, selectedType, selectedRegion]);

  return (
    <div className="members-page-wrapper">
      {/* Banner */}
      <section className="page-hero-banner">
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>Member Management</span>
          <h1 className="page-hero-title">회원관리</h1>
          <p className="page-hero-desc">
            세종 로컬 창업 생태계를 주도하는 동료들과 연결되세요. <br />
            정회원 온라인 등록 신청 및 다양한 업종별 회원 디렉토리 검색 시스템을 운영합니다.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="nav-tab-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabChange('register')}
          >
            정회원 등록 신청
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => handleTabChange('directory')}
          >
            회원 디렉토리 조회
          </button>
        </div>

        {/* Tab 1: Register */}
        {activeTab === 'register' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="grid-2">
              {/* Info Column */}
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-emerald-deep)', marginBottom: '16px' }}>정회원 혜택 및 절차</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-charcoal-deep)', fontSize: '15px', marginBottom: '4px' }}>✨ 브랜드 아카이빙 및 로컬 맵 무료 등재</h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                      협회 통합 사이트 내 브랜드 스토리 상세 페이지 제작 및 지도 내 핀 마커 제공을 통해 온라인 노출 극대화.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-charcoal-deep)', fontSize: '15px', marginBottom: '4px' }}>🎪 협회 네트워킹 및 기획 팝업 우선 참가</h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                      매월 열리는 세로데이 정기 네트워킹 우선 무료 참여, 그리고 팝업마켓 행사 입점비 감면 및 우선권 부여.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-charcoal-deep)', fontSize: '15px', marginBottom: '4px' }}>🏦 연회비 및 납부 안내</h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                      - 연회비: 100,000원 <br />
                      - 납부 계좌: 우리은행 1005-901-223456 (예금주: 사단법인 세종로컬창업가협회)
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '24px', padding: '16px', background: 'var(--color-emerald-pale)', borderRadius: '8px', border: '1px solid rgba(10, 92, 54, 0.2)' }}>
                  <h4 style={{ color: 'var(--color-emerald-deep)', marginBottom: '6px', fontSize: '14px' }}>📋 구글폼 간편 등록 신청</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', marginBottom: '12px' }}>
                    웹 신청이 어렵거나 모바일에서 구글 계정으로 빠르게 신청하고 싶으신가요?
                  </p>
                  <a 
                    href="https://forms.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-all-link"
                    style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-emerald-deep)', borderColor: 'var(--color-emerald-deep)' }}
                  >
                    공식 구글폼 가입 신청 바로가기 🔗
                  </a>
                </div>
              </div>

              {/* Form Column */}
              <div className="glass-panel interactive-form-card" style={{ backgroundColor: 'var(--color-white)' }}>
                <div className="form-step-indicator">
                  <div className={`step-node ${formStep >= 1 ? 'active' : ''} ${formStep > 1 ? 'done' : ''}`}>1</div>
                  <div className={`step-node ${formStep >= 2 ? 'active' : ''} ${formStep > 2 ? 'done' : ''}`}>2</div>
                  <div className={`step-node ${formStep >= 3 ? 'active' : ''}`}>3</div>
                </div>

                {formStep === 1 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)' }}>1단계: 인적 사항 입력</h3>
                    <div className="form-group">
                      <label htmlFor="reg-name">대표자명</label>
                      <input 
                        id="reg-name"
                        type="text" 
                        required 
                        placeholder="이름을 입력하세요" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                    <button 
                      type="button" 
                      className="subscribe-btn"
                      onClick={() => { if(name) setFormStep(2); else alert('대표자명을 적어주세요.'); }}
                    >
                      다음 단계로 ➔
                    </button>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)' }}>2단계: 브랜드 및 협업 정보</h3>
                    <div className="form-group">
                      <label htmlFor="reg-brand">브랜드 (회사)명</label>
                      <input 
                        id="reg-brand"
                        type="text" 
                        required 
                        placeholder="회사명을 입력하세요" 
                        value={brand} 
                        onChange={(e) => setBrand(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reg-collab">협업 가능 분야</label>
                      <input 
                        id="reg-collab"
                        type="text" 
                        required 
                        placeholder="예) 조치원 복숭아 가공품 도매 납품" 
                        value={collab} 
                        onChange={(e) => setCollab(e.target.value)} 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        type="button" 
                        className="subscribe-btn" 
                        style={{ background: '#aaa', flex: 1 }} 
                        onClick={() => setFormStep(1)}
                      >
                        이전
                      </button>
                      <button 
                        type="button" 
                        className="subscribe-btn" 
                        style={{ flex: 2 }} 
                        onClick={() => { if(brand && collab) setFormStep(3); else alert('브랜드명과 협업 분야를 기입해주세요.'); }}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)' }}>3단계: 입회비 확인 및 완료</h3>
                    <p style={{ fontSize: '14.5px', color: 'var(--color-gray-dark)', lineHeight: '1.6' }}>
                      정회원 등록을 마치시려면 아래 계좌로 입회비를 납부해 주시기 바랍니다. <br />
                      납부 시 입금자명은 <strong>"신청인명+브랜드명"</strong>으로 해주시면 빠른 확인이 가능합니다.
                    </p>
                    <div style={{ background: 'var(--color-sand-light)', padding: '16px', borderRadius: '4px', fontSize: '14px', border: '1px solid var(--color-gray-light)' }}>
                      <strong>우리은행 1005-901-223456</strong><br />
                      사단법인 세종로컬창업가협회
                    </div>
                    <button 
                      type="button" 
                      className="subscribe-btn"
                      onClick={() => {
                        alert('온라인 가입신청 접수가 임시 완료되었습니다. 회비 입금 확인 후 가입 승인 처리됩니다.');
                        setFormStep(1);
                        setName('');
                        setBrand('');
                        setCollab('');
                      }}
                    >
                      가입 완료하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Directory */}
        {activeTab === 'directory' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: '20px', backgroundColor: 'var(--color-white)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Search input */}
              <div style={{ position: 'relative', width: '300px' }}>
                <input 
                  type="text" 
                  placeholder="대표명, 브랜드, 협업 내용 검색..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', border: '1px solid var(--color-gray-light)', padding: '10px 12px 10px 32px', borderRadius: '4px', background: 'var(--color-sand-light)', fontSize: '14px' }}
                />
                <span style={{ position: 'absolute', left: '10px', top: '12px' }}>🔍</span>
              </div>

              {/* Category Dropdowns */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label htmlFor="dir-type" style={{ fontSize: '12px', fontWeight: '700' }}>업종</label>
                  <select 
                    id="dir-type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{ border: '1px solid var(--color-gray-light)', padding: '8px', borderRadius: '4px', background: 'var(--color-sand-light)', fontSize: '13px' }}
                  >
                    <option value="All">전체</option>
                    <option value="F&B">F&B (식품/카페)</option>
                    <option value="Culture">Culture (문화/예술)</option>
                    <option value="Craft">Craft (공예/디자인)</option>
                    <option value="Space">Space (공간대관/오피스)</option>
                    <option value="Goods">Goods (상품/패키징)</option>
                    <option value="Education">Education (교육/관광)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label htmlFor="dir-region" style={{ fontSize: '12px', fontWeight: '700' }}>지역</label>
                  <select 
                    id="dir-region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    style={{ border: '1px solid var(--color-gray-light)', padding: '8px', borderRadius: '4px', background: 'var(--color-sand-light)', fontSize: '13px' }}
                  >
                    <option value="All">전체</option>
                    <option value="조치원읍">조치원읍</option>
                    <option value="나성동">나성동</option>
                    <option value="금남면">금남면</option>
                    <option value="연서면">연서면</option>
                    <option value="아름동">아름동</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {filteredMembers.length > 0 ? (
              <div className="grid-3">
                {filteredMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '24px', 
                      backgroundColor: 'var(--color-white)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      borderLeft: '4px solid var(--color-emerald-deep)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-emerald">{member.type}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-gray-medium)', fontWeight: '700' }}>📍 {member.region}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '4px' }}>{member.brand}</h4>
                      <span style={{ fontSize: '13px', color: 'var(--color-gray-dark)' }}>대표: <strong>{member.rep}</strong></span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-gray-light)', paddingTop: '10px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-orange-accent)', display: 'block', marginBottom: '2px' }}>🤝 협업 가능 분야</span>
                      <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>{member.collaboration}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-results-box">
                <span className="empty-icon">🔍</span>
                <h3>조건에 일치하는 협회 정회원이 없습니다.</h3>
                <p>다른 검색어 및 필터 조건을 시도해 보세요.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading Members...</div>}>
      <AboutContentWrap />
    </Suspense>
  );
}

function AboutContentWrap() {
  return <MembersContent />;
}
