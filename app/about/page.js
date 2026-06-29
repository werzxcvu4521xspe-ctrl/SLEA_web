'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function AboutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'intro';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.push(`/about?tab=${tabName}`, { scroll: false });
  };

  const leaders = [
    { name: '김태균', role: '공동리더 / 회장', company: '조치원 브루어리 대표', desc: '세종시 로컬 양조장 재생 프로젝트 기획 및 지역 맥주 브랜드 개척자.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop' },
    { name: '이지영', role: '공동리더 / 부회장', company: '디저트 카페 도원 대표', desc: '로컬 F&B 창업 컨설팅 및 농가 상생 브랜딩 전문가.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop' }
  ];

  const executives = [
    { name: '박민수', role: '사무국장', company: '로컬허브 나성 대표', desc: '협회 행정 총괄 및 네트워킹 행사 기획.' },
    { name: '최소연', role: '재무이사', company: '공방 세종 대표', desc: '회비 관리 및 투명한 협회 재정 운영.' },
    { name: '정우진', role: '대외협력이사', company: '단차 한옥찻집 대표', desc: 'MOU 체결 및 공공기관 파트너십 구축.' }
  ];

  const advisors = [
    { name: '이성호 교수', role: '학술 자문', company: '고려대학교 세종캠퍼스', desc: '도시재생 및 지역창업 비즈니스 모델 연구 자문.' },
    { name: '한아름 디렉터', role: '브랜딩 자문', company: '스튜디오 세종', desc: '로컬 기업 브랜드 아이덴티티 및 디자인 디렉팅.' }
  ];

  const history = [
    { year: '2026', title: '통합 플랫폼 오픈 및 회원 150개사 돌파', desc: '정회원 100개사, 파트너 50개사 연계 로컬 쇼핑몰 및 구인구직 자유게시판 통합.' },
    { year: '2025', title: '지자체 협력 로컬 크리에이터 활성화 지원사업 수주', desc: '세종시 로컬 멘토링 데이 연 12회 개최 및 팝업그로잉마켓 정기 운영.' },
    { year: '2024', title: '세종로컬창업가협회 정식 사단법인 인가', desc: 'MOU 대학(고려대, 홍익대) 연계 및 초대 임원진 및 공동리더 선출.' },
    { year: '2023', title: '협회 발족 및 첫 세로데이 개최', desc: '조치원 브루어리에서 세종시 로컬 창업가 30인이 모여 소통과 협력의 장을 마련.' }
  ];

  const mous = [
    { name: '세종특별자치시청', type: '공공기관', relation: '로컬 크리에이터 창업 지원 사업 파트너' },
    { name: '고려대학교 세종창업지원단', type: '대학', relation: '대학생 청년 창업가 멘토링 및 실습 협력' },
    { name: '세종창조경제혁신센터', type: '공공기관', relation: '스타트업 보육 및 판로 지원 협력' },
    { name: '홍익대학교 세종캠퍼스 산학협력단', type: '대학', relation: '디자인 및 로컬 콘텐츠 공동 개발' },
    { name: '세종도시재생지원센터', type: '공공기관', relation: '원도심 활성화 및 청년 창업 공간 연계' },
    { name: '충청 로컬 얼라이언스', type: '민간기업', relation: '충청권 로컬 창업 생태계 네트워크 공유' }
  ];

  return (
    <div className="about-page-wrapper">
      {/* Banner */}
      <section className="page-hero-banner">
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>Association Introduction</span>
          <h1 className="page-hero-title">협회소개</h1>
          <p className="page-hero-desc">
            당신이 중심이 되는 로컬, 세계를 움직이는 세종의 엔진. <br />
            세종로컬창업가협회는 지역 창업가들의 성장과 협력을 도모합니다.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="nav-tab-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
            onClick={() => handleTabChange('intro')}
          >
            소개 & 설립목적
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'leaders' ? 'active' : ''}`}
            onClick={() => handleTabChange('leaders')}
          >
            임원 및 자문위원
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleTabChange('history')}
          >
            협회 연혁
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'mou' ? 'active' : ''}`}
            onClick={() => handleTabChange('mou')}
          >
            MOU 기관 현황
          </button>
        </div>

        {/* Tab Content 1: Intro */}
        {activeTab === 'intro' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="glass-panel" style={{ padding: '40px', backgroundColor: 'var(--color-white)' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--color-emerald-deep)' }}>협회 설립 목적</h2>
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--color-gray-dark)', marginBottom: '24px' }}>
                세종로컬창업가협회는 세종특별자치시를 기반으로 활동하는 로컬 크리에이터, 청년 창업가, 소상공인들이 
                스스로 모여 설립한 민간 자율 협회입니다. 세종시만의 독창적인 자원과 역사적 가치를 재발견하여 새로운 브랜드와 비즈니스를 창출하고, 
                지속 가능한 지역 경제 활성화에 기여함을 목적으로 합니다.
              </p>
              <div className="grid-3">
                <div style={{ padding: '20px', background: 'var(--color-sand-light)', borderRadius: 'var(--border-radius-md)' }}>
                  <h4 style={{ color: 'var(--color-emerald-medium)', marginBottom: '8px' }}>🤝 네트워크 공유</h4>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', lineHeight: '1.6' }}>
                    창업가 간 정보 교류, 협업 상품 개발, 공동 마케팅 추진을 위한 플랫폼을 마련합니다.
                  </p>
                </div>
                <div style={{ padding: '20px', background: 'var(--color-sand-light)', borderRadius: 'var(--border-radius-md)' }}>
                  <h4 style={{ color: 'var(--color-emerald-medium)', marginBottom: '8px' }}>📚 역량 강화</h4>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', lineHeight: '1.6' }}>
                    전문가 멘토링, 브랜딩 및 AI 기술 교육을 통해 로컬 브랜드의 경쟁력을 세계적 수준으로 격상시킵니다.
                  </p>
                </div>
                <div style={{ padding: '20px', background: 'var(--color-sand-light)', borderRadius: 'var(--border-radius-md)' }}>
                  <h4 style={{ color: 'var(--color-emerald-medium)', marginBottom: '8px' }}>🏛️ 정책 제안</h4>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', lineHeight: '1.6' }}>
                    행정 및 공공기관과의 협력을 이끌어내고, 현장의 목소리를 반영한 창업 지원 정책을 건의합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '12px' }}>🎯 협회 미션 (Mission)</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--color-gray-dark)' }}>
                  "세종 로컬 창업가의 목소리를 대변하고, 상생 발전하는 자생적 생태계를 완성하여 로컬을 넘어 세계적인 브랜드로 성장할 수 있는 디딤돌이 된다."
                </p>
              </div>
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '12px' }}>🚀 협회 비전 (Vision)</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--color-gray-dark)' }}>
                  "대한민국 행정의 중심 세종을 넘어, 로컬 크리에이티브의 허브이자 세계 속의 매력적인 로컬 창업 강소 도시로 도약한다."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Leaders */}
        {activeTab === 'leaders' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {/* Joint Leaders */}
            <div>
              <h3 style={{ fontSize: '22px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '24px' }}>
                👥 공동 리더 소개
              </h3>
              <div className="grid-2">
                {leaders.map((leader, i) => (
                  <div key={i} className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '24px', backgroundColor: 'var(--color-white)' }}>
                    <img src={leader.img} alt={leader.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-orange-accent)' }}>{leader.role}</span>
                      <h4 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)' }}>{leader.name}</h4>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-gray-dark)' }}>{leader.company}</span>
                      <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', marginTop: '8px', lineHeight: '1.5' }}>{leader.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executives & Advisors Grid */}
            <div className="grid-2">
              <div>
                <h3 style={{ fontSize: '20px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '20px' }}>
                  👔 임원진 소개
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {executives.map((exec, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '20px', backgroundColor: 'var(--color-white)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <h4 style={{ fontSize: '16px' }}>{exec.name} <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-gray-dark)' }}>{exec.role}</span></h4>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-emerald-medium)' }}>{exec.company}</span>
                      </div>
                      <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)' }}>{exec.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '20px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '20px' }}>
                  🎓 자문위원 소개
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {advisors.map((adv, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '20px', backgroundColor: 'var(--color-white)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <h4 style={{ fontSize: '16px' }}>{adv.name} <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-gray-dark)' }}>{adv.role}</span></h4>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-orange-accent)' }}>{adv.company}</span>
                      </div>
                      <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)' }}>{adv.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: History */}
        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '22px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '24px' }}>
              📜 협회 연혁
            </h3>
            <div className="timeline-container">
              {history.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-year">{item.year}</div>
                  <div className="timeline-content-card">
                    <h4 style={{ fontSize: '16px', color: 'var(--color-charcoal-deep)', marginBottom: '8px' }}>{item.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 4: MOU */}
        {activeTab === 'mou' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '22px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '24px' }}>
              🤝 MOU 기관 현황
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--color-gray-dark)', marginBottom: '24px', lineHeight: '1.6' }}>
              세종로컬창업가협회는 다각적인 협동 파트너십 구축을 통해 지속 가능한 로컬 비즈니스 기반을 견고히 다지고 있습니다.
            </p>
            <div className="grid-3">
              {mous.map((mou, i) => (
                <div key={i} className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--color-white)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="badge badge-emerald" style={{ width: 'fit-content' }}>{mou.type}</span>
                  <h4 style={{ fontSize: '17px', color: 'var(--color-charcoal-deep)' }}>{mou.name}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>{mou.relation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading About...</div>}>
      <AboutContent />
    </Suspense>
  );
}
