'use client';

import { useState } from 'react';

const PARTNERS = [
  { name: '세종창조경제혁신센터', category: '공공기관', desc: '세종시 스타트업 보육 인프라 및 자금 연계 파트너십.' },
  { name: '고려대학교 창업지원단', category: '대학', desc: '대학생 청년 로컬 크리에이터 인큐베이팅 및 연계 교육 진행.' },
  { name: '세종특별자치시도시재생지원센터', category: '공공기관', desc: '조치원 등 원도심 유휴 공간 활성화 프로젝트 공동 기획.' },
  { name: '홍익대학교 세종캠퍼스 산학협력단', category: '대학', desc: '로컬 디자인 리서치 및 산학 R&D 공동 연구 추진.' },
  { name: '충청 로컬 얼라이언스', category: '전문가 그룹', desc: '충청권 전역의 로컬 씬 활성화를 위한 민간 네트워크 얼라이언스.' },
  { name: '스튜디오 세종', category: '기업', desc: '정회원 브랜드 홍보 촬영 및 브랜드 아이덴티티(BI) 컨설팅 제휴.' }
];

export default function PartnershipPage() {
  const [partnerType, setPartnerType] = useState('mou');
  const [orgName, setOrgName] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orgName || !proposalText) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOrgName('');
      setProposalText('');
      alert('제휴 제안이 성공적으로 접수되었습니다. 협회 대외협력팀에서 이메일로 연락해 드립니다.');
    }, 1000);
  };

  return (
    <div className="partnership-page-wrapper">
      {/* Banner */}
      <section className="page-hero-banner" style={{ marginTop: '100px' }}>
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>Partnership</span>
          <h1 className="page-hero-title">파트너십</h1>
          <p className="page-hero-desc">
            세종 로컬의 무한한 가능성을 함께 확장할 파트너를 찾습니다. <br />
            MOU 협약 기관, 대학교, 민간 기업, 공공 기관과 상생 생태계를 설계하고 있습니다.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '40px', paddingBottom: '100px' }}>
        <div className="grid-2">
          {/* Partners List */}
          <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--color-emerald-deep)', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '20px' }}>
              🤝 주요 협력 & MOU 체결 기관
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {PARTNERS.map((partner, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--color-sand-medium)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '16px', color: 'var(--color-charcoal-deep)' }}>{partner.name}</h4>
                    <span className="badge badge-emerald">{partner.category}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', lineHeight: '1.4' }}>{partner.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--color-charcoal-deep)', borderBottom: '2px solid var(--color-orange-accent)', paddingBottom: '8px', marginBottom: '20px' }}>
              ✉️ 전략적 제휴 및 MOU 문의
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', lineHeight: '1.6', marginBottom: '20px' }}>
              협회와의 공동 사업 기획, 로컬 창업 인프라 매칭, 대학교 청년 현장 실습 등 다양한 협력을 환영합니다.
            </p>
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="form-group">
                <label>제휴 분야 선택</label>
                <select 
                  value={partnerType} 
                  onChange={(e) => setPartnerType(e.target.value)}
                  style={{ border: '1px solid var(--color-gray-light)', padding: '10px', borderRadius: '4px', background: 'var(--color-sand-light)', fontWeight: '600' }}
                >
                  <option value="mou">공식 MOU 협약 체결</option>
                  <option value="univ">대학 산학 협동 프로젝트</option>
                  <option value="corporate">민간 대기업 협력 / 스폰서십</option>
                  <option value="expert">전문가 자문단 합류</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="partner-org">기관 / 기업 / 대학명</label>
                <input 
                  id="partner-org"
                  type="text" 
                  required 
                  placeholder="예) 고려대학교 세종캠퍼스 산학협력단" 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="partner-text">제휴 제안 내용 요약</label>
                <textarea 
                  id="partner-text"
                  required 
                  rows="5" 
                  placeholder="희망하는 파트너십 형태 및 공동 추진하고자 하는 프로젝트 내용을 간략히 명시해 주세요." 
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  style={{ border: '1px solid var(--color-gray-light)', padding: '12px', borderRadius: '4px', background: 'var(--color-sand-light)', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px' }}
                />
              </div>

              <button type="submit" className="subscribe-btn" style={{ marginTop: '10px' }}>
                협력 제휴안 전송하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
