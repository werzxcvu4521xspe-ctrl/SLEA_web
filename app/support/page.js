'use client';

import { useState } from 'react';

const RESOURCES = [
  { id: 1, type: 'HWP', category: 'proposal', name: '2026 세종시 로컬 크리에이터 활성화 지원사업 표준 사업계획서 양식', size: '1.2 MB', count: 142 },
  { id: 2, type: 'PPTX', category: 'template', name: '원페이지 투자 유치(IR) 피칭덱 슬라이드 테마 템플릿', size: '3.4 MB', count: 98 },
  { id: 3, type: 'PDF', category: 'gov', name: '중소벤처기업부 예비/초기창업패키지 로컬벤처 분야 합격 계획서 모음 가이드', size: '5.1 MB', count: 210 },
  { id: 4, type: 'PDF', category: 'ai', name: '로컬 창업가를 위한 생성형 AI 활용 SNS 카드뉴스 디자인 & 상세페이지 자동화 가이드', size: '8.7 MB', count: 320 },
  { id: 5, type: 'PDF', category: 'marketing', name: '초기 브랜드 고객 100명 확보를 위한 타깃 맞춤형 인스타그램 마케팅 핸드북', size: '2.8 MB', count: 185 }
];

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [materials, setMaterials] = useState(RESOURCES);

  const handleDownload = (id, name) => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        return { ...m, count: m.count + 1 };
      }
      return m;
    }));
    alert(`"${name}" 파일 다운로드가 시작되었습니다.`);
  };

  const filteredResources = selectedCategory === 'all'
    ? materials
    : materials.filter(m => m.category === selectedCategory);

  return (
    <div className="support-page-wrapper">
      {/* Banner */}
      <section className="page-hero-banner" style={{ marginTop: '100px' }}>
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>Support Center</span>
          <h1 className="page-hero-title">창업지원센터</h1>
          <p className="page-hero-desc">
            세종 로컬 창업가들의 체계적인 성장을 지원하는 리소스 자료실. <br />
            실무 사업계획서 서식, 발표 피칭 피치덱, 정부 사업 공고, AI 툴 가이드를 무료로 제공합니다.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '40px', paddingBottom: '100px' }}>
        {/* Category filtering tab */}
        <div className="nav-tab-bar">
          {[
            { code: 'all', name: '전체 자료' },
            { code: 'proposal', name: '사업계획서 자료실' },
            { code: 'template', name: '창업 템플릿' },
            { code: 'gov', name: '정부지원사업' },
            { code: 'ai', name: 'AI 활용 가이드' },
            { code: 'marketing', name: '마케팅 자료실' }
          ].map(tab => (
            <button
              key={tab.code}
              type="button"
              className={`tab-btn ${selectedCategory === tab.code ? 'active' : ''}`}
              onClick={() => setSelectedCategory(tab.code)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Resources list container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredResources.map(res => (
            <div key={res.id} className="support-file-row">
              <div className="file-info-group">
                <div className="file-type-icon">{res.type}</div>
                <div className="file-meta-group">
                  <h4 className="file-title-txt">{res.name}</h4>
                  <span className="file-meta-details">파일 용량: {res.size} | 다운로드 수: <strong>{res.count}회</strong></span>
                </div>
              </div>

              <button 
                type="button" 
                className="download-icon-btn" 
                title="다운로드"
                onClick={() => handleDownload(res.id, res.name)}
              >
                ⬇️
              </button>
            </div>
          ))}

          {filteredResources.length === 0 && (
            <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-gray-dark)', fontWeight: 'bold' }}>
              해당 카테고리에 업로드된 문서 자료가 아직 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
