'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'seroday';
  const [activeTab, setActiveTab] = useState(tabParam);

  // Mentoring Form State
  const [mentorType, setMentorType] = useState('professor');
  const [mentorName, setMentorName] = useState('');
  const [mentorDesc, setMentorDesc] = useState('');
  const [mentorSubmitted, setMentorSubmitted] = useState(false);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.push(`/activities?tab=${tabName}`, { scroll: false });
  };

  const handleMentoringSubmit = (e) => {
    e.preventDefault();
    if (!mentorName || !mentorDesc) return;
    setMentorSubmitted(true);
    setTimeout(() => {
      setMentorSubmitted(false);
      setMentorName('');
      setMentorDesc('');
      alert('멘토링 신청이 정상적으로 접수되었습니다. 담당자가 순차적으로 개별 연락드립니다.');
    }, 1000);
  };

  const seroReviews = [
    { title: '수제 맥주 콜라보의 시작점이 되었습니다!', author: '조치원 브루어리 김유리 대표', text: '세로데이 정기 네트워킹에 참여해 F&B 분야 동료 창업가들을 만나 세종시 쌀을 결합한 쌀 맥주 프로젝트 기획을 시작할 수 있었습니다. 정말 강추합니다!' },
    { title: '협업 시너지와 힐링을 동시에 얻는 행사', author: '공방 세종 정소민 대표', text: '매번 다른 주제와 공간에서 열리는 네트워킹 행사를 통해 지쳐있던 창업 과정에서 큰 에너지를 얻고 실제 플리마켓 연계 협업도 성사되었습니다.' }
  ];

  const educations = [
    { title: '로컬 크리에이터 브랜드 빌딩 마스터 클래스', type: '브랜딩 교육', duration: '4주 코스', status: '모집중', desc: '내 브랜드만의 고유한 로컬 스토리를 발굴하고 시각적 로고 및 패키지 아이덴티티를 확립하는 실습 교육.' },
    { title: '생성형 AI 툴을 활용한 콘텐츠 마케팅 및 자동화', type: 'AI 활용 교육', duration: '원데이 특강', status: '마감', desc: 'ChatGPT와 Midjourney 등을 활용해 SNS 홍보 카피라이팅 및 상세 페이지 이미지 리소스를 직접 생성하고 자동화하는 워크숍.' },
    { title: '정부 지원 사업 합격을 위한 사업계획서 작성 및 피칭', type: '사업계획서', duration: '2주 집중', status: '모집중', desc: '로컬벤처 및 예비창업패키지 합격을 목표로 사업 요약문 작성법부터 핵심 지표 표현 및 발표 노하우 전수.' }
  ];

  return (
    <div className="activities-page-wrapper">
      {/* Banner */}
      <section className="page-hero-banner">
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>Association Activities</span>
          <h1 className="page-hero-title">협회활동</h1>
          <p className="page-hero-desc">
            세종의 창업가들을 연결하고 도약시키는 원동력. <br />
            정기 네트워킹, 전문가 밀착 멘토링, 실무 중심 교육, 로컬 마켓을 하나로 제공합니다.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="nav-tab-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'seroday' ? 'active' : ''}`}
            onClick={() => handleTabChange('seroday')}
          >
            세로데이 (정기 네트워킹)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'mentoring' ? 'active' : ''}`}
            onClick={() => handleTabChange('mentoring')}
          >
            멘토링데이 (1:1 컨설팅)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => handleTabChange('education')}
          >
            교육 · 특강
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'popup' ? 'active' : ''}`}
            onClick={() => handleTabChange('popup')}
          >
            팝업마켓
          </button>
        </div>

        {/* Tab 1: Sero Day */}
        {activeTab === 'seroday' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="glass-panel" style={{ padding: '40px', backgroundColor: 'var(--color-white)' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-emerald-deep)' }}>세로데이 (Sejong Local Day)란?</h2>
              <p style={{ fontSize: '15.5px', lineHeight: '1.8', color: 'var(--color-gray-dark)', marginBottom: '24px' }}>
                매월 마지막 주 금요일 저녁, 세종시 전역의 로컬 크리에이터와 브랜드 기획자들이 한데 모여 편안한 분위기 속에서 
                서로의 비즈니스를 공유하고 협업 아이디어를 논의하는 **세종시 최대 로컬 창업 정기 네트워킹 프로그램**입니다.
              </p>

              {/* Sero Day Photo Gallery */}
              <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '16px' }}>📸 행사 사진 현황</h3>
              <div className="photo-gallery-grid" style={{ marginBottom: '40px' }}>
                <div className="gallery-card">
                  <div className="gallery-img-wrapper" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop")' }}>
                    <span className="gallery-tag">제15회 세로데이</span>
                  </div>
                  <div className="gallery-info">
                    <h4 className="gallery-title">조치원 양조장 재생 공간 네트워킹</h4>
                    <span className="gallery-date">2026.06.26 | 참석인원 45명</span>
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="gallery-img-wrapper" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop")' }}>
                    <span className="gallery-tag">제14회 세로데이</span>
                  </div>
                  <div className="gallery-info">
                    <h4 className="gallery-title">나성동 공유 오피스 비즈니스 스케일업</h4>
                    <span className="gallery-date">2026.05.29 | 참석인원 38명</span>
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="gallery-img-wrapper" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop")' }}>
                    <span className="gallery-tag">제13회 세로데이</span>
                  </div>
                  <div className="gallery-info">
                    <h4 className="gallery-title">봄철 맞이 금남면 야외 캠프 네트워킹</h4>
                    <span className="gallery-date">2026.04.24 | 참석인원 50명</span>
                  </div>
                </div>
              </div>

              {/* Sero Reviews */}
              <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '16px' }}>💬 참여자 생생 후기</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {seroReviews.map((rev, i) => (
                  <div key={i} style={{ padding: '20px', borderLeft: '4px solid var(--color-orange-accent)', background: 'var(--color-sand-light)', borderRadius: '0 var(--border-radius-md) var(--border-radius-md) 0' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>"{rev.title}"</h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.6', marginBottom: '8px' }}>{rev.text}</p>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-emerald-medium)' }}>{rev.author}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Mentoring */}
        {activeTab === 'mentoring' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="grid-2">
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h2 style={{ fontSize: '20px', color: 'var(--color-emerald-deep)', marginBottom: '16px' }}>멘토링 지원 프로그램</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-charcoal-deep)', fontSize: '15px', marginBottom: '4px' }}>🎓 대학교 전문 교수 멘토링</h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                      고려대, 홍익대 등 세종 관내 대학 교수진과 1:1 매칭되어 학술 연구 기반의 기술 자문 및 산학 협력 R&D 사업 기회를 모색합니다.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-charcoal-deep)', fontSize: '15px', marginBottom: '4px' }}>💼 실무 분야 전문가 멘토링</h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                      마케팅, 유통, 법률/특허, 세무/회계 등 10개 실무 분과 전문가 풀을 통해 현재 브랜드가 당면한 구체적인 문제의 처방을 얻습니다.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-charcoal-deep)', fontSize: '15px', marginBottom: '4px' }}>🚀 정기 로컬 창업 컨설팅</h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                      브랜드 아이덴티티 수립부터 패키징, 온라인 쇼핑몰 입점 및 크라우드 펀딩 런칭까지 단계별 패스트트랙 성장 솔루션을 제공합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mentoring Form */}
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '16px' }}>📩 1:1 멘토링 및 컨설팅 신청</h3>
                <form className="newsletter-form" onSubmit={handleMentoringSubmit}>
                  <div className="form-group">
                    <label>멘토링 희망 분과</label>
                    <select 
                      value={mentorType} 
                      onChange={(e) => setMentorType(e.target.value)}
                      style={{ border: '1px solid var(--color-gray-light)', padding: '10px', borderRadius: '4px', background: 'var(--color-sand-light)', fontWeight: '600' }}
                    >
                      <option value="professor">대학교 전문 교수 멘토링</option>
                      <option value="business">실무 전문가 멘토링 (마케팅/법률/세무)</option>
                      <option value="consulting">창업 및 비즈니스 모델 컨설팅</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mentor-name">회사명 및 대표명</label>
                    <input 
                      id="mentor-name"
                      type="text" 
                      required 
                      placeholder="예) 조치원 맥주 김유리 대표" 
                      value={mentorName} 
                      onChange={(e) => setMentorName(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mentor-desc">멘토링받고 싶은 구체적인 내용</label>
                    <textarea 
                      id="mentor-desc"
                      required 
                      rows="4" 
                      placeholder="직면하고 있는 애로사항이나 희망하는 피드백 내용을 자세히 적어주세요." 
                      value={mentorDesc}
                      onChange={(e) => setMentorDesc(e.target.value)}
                      style={{ border: '1px solid var(--color-gray-light)', padding: '12px', borderRadius: '4px', background: 'var(--color-sand-light)', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px' }}
                    />
                  </div>
                  <button type="submit" className="subscribe-btn" style={{ marginTop: '10px' }}>
                    컨설팅 신청서 전송하기
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Education */}
        {activeTab === 'education' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '20px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '24px' }}>
              📚 아카데미 교육 및 특강 리스트
            </h3>
            <div className="grid-3">
              {educations.map((edu, i) => (
                <div key={i} className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--color-white)', display: 'flex', flexDirection: 'column', justifyPath: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-emerald">{edu.type}</span>
                    <span className={`badge ${edu.status === '모집중' ? 'badge-apply' : ''}`} style={{ background: edu.status === '마감' ? '#ddd' : '', color: edu.status === '마감' ? '#555' : '' }}>
                      {edu.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '17px', color: 'var(--color-charcoal-deep)', marginBottom: '8px', lineHeight: '1.4' }}>{edu.title}</h4>
                  <span style={{ fontSize: '13px', color: 'var(--color-orange-accent)', fontWeight: '700', marginBottom: '10px', display: 'block' }}>⏰ 교육 기간: {edu.duration}</span>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>{edu.desc}</p>
                  
                  <button 
                    type="button" 
                    className="subscribe-btn" 
                    style={{ width: '100%', padding: '10px 0', height: 'auto', borderRadius: '4px', background: edu.status === '마감' ? '#aaa' : '', cursor: edu.status === '마감' ? 'not-allowed' : 'pointer' }}
                    disabled={edu.status === '마감'}
                    onClick={() => alert(`"${edu.title}" 교육 신청 페이지로 이동합니다.`)}
                  >
                    {edu.status === '모집중' ? '수강 신청하기' : '마감되었습니다'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Popup Market */}
        {activeTab === 'popup' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '40px', backgroundColor: 'var(--color-white)' }}>
              <h2 style={{ fontSize: '22px', color: 'var(--color-emerald-deep)', marginBottom: '12px' }}>로컬 판로 개척 팝업마켓</h2>
              <p style={{ fontSize: '15px', color: 'var(--color-gray-dark)', lineHeight: '1.7', marginBottom: '24px' }}>
                협회 정회원 브랜드들의 실질적인 매출 증대와 인지도 확산을 위해, 세종시 내 유동인구가 집중되는 랜드마크 공간에서 
                정기 팝업과 전시를 주최합니다.
              </p>

              <div className="grid-3">
                <div style={{ border: '1px solid var(--color-gray-light)', padding: '20px', borderRadius: '8px', background: 'var(--color-sand-light)' }}>
                  <h4 style={{ color: 'var(--color-orange-accent)', fontSize: '16px', marginBottom: '6px' }}>🛍️ 팝업그로잉마켓</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                    백화점, 대형 아울렛 등 대형 유통망과 제휴하여 진행하는 고부가가치 로컬 브랜드 특별 팝업 위크 프로그램.
                  </p>
                </div>
                <div style={{ border: '1px solid var(--color-gray-light)', padding: '20px', borderRadius: '8px', background: 'var(--color-sand-light)' }}>
                  <h4 style={{ color: 'var(--color-orange-accent)', fontSize: '16px', marginBottom: '6px' }}>🎨 기획 전시마켓</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                    로컬 공예품, 패션, 도자 분야 창업가들의 예술 작품과 한정판 제품들을 갤러리/한옥 찻집 등에서 조화롭게 소개하는 기획전.
                  </p>
                </div>
                <div style={{ border: '1px solid var(--color-gray-light)', padding: '20px', borderRadius: '8px', background: 'var(--color-sand-light)' }}>
                  <h4 style={{ color: 'var(--color-orange-accent)', fontSize: '16px', marginBottom: '6px' }}>🎪 상생 플리마켓</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                    세로데이 행사 및 세종 축제 기간 중 시민들과 가깝게 소통할 수 있는 오픈 마켓으로 친근한 브랜드 이미지를 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading Activities...</div>}>
      <ActivitiesContent />
    </Suspense>
  );
}
