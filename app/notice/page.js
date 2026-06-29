'use client';

import { useState } from 'react';

const MOCK_NOTICES = [
  {
    id: 1,
    title: '[공모전] 2026 세종 로컬 크리에이티브 혁신 제품 공모전 참가 기업 모집',
    date: '2026-06-28',
    category: '공모전 정보',
    content: '세종시 소상공인 및 창업기업을 대상으로 혁신적인 로컬 제품 디자인 및 기술 아이디어를 공모합니다. 선정 시 최대 1,000만원 제품 고도화 자금 및 상장이 부여됩니다.'
  },
  {
    id: 2,
    title: '[세로데이] 7월 세종 로컬 창업 네트워킹 데이 & 비즈니스 멘토링 프로그램 참가자 모집',
    date: '2026-06-25',
    category: '세로데이 모집',
    content: '오는 7월 12일 나성동 로컬허브에서 마케팅 및 브랜드 디렉팅 전문가를 초빙하여 로컬 멘토링 데이를 개최합니다. 선착순 20명 모집 마감되오니 마이페이지에서 신청해 주시기 바랍니다.'
  },
  {
    id: 3,
    title: '[정기행사] 2026 하반기 세종로컬창업가협회 정기 상생 컨퍼런스 개최 안내',
    date: '2026-06-20',
    category: '정기행사 안내',
    content: '세종시청 대강당에서 세종 로컬 창업가와 전국 로컬 기획자들이 한데 모여 [로컬의 미래와 연대]를 주제로 컨퍼런스를 개최합니다. 네트워킹 만찬이 제공됩니다.'
  },
  {
    id: 4,
    title: '[교육] 로컬 브랜딩 마스터클래스 1기 수강생 선착순 모집',
    date: '2026-06-15',
    category: '교육 안내',
    content: '현업 브랜드 디자이너와 카피라이터가 직강하는 4주 코스 실무 워크숍입니다. 정회원은 무료로 수강 가능하며 선착순 15명 선발 예정입니다.'
  },
  {
    id: 5,
    title: '[지원사업] 2026년 하반기 세종 로컬 크리에이터 브랜드 아카이빙 등록 접수 안내',
    date: '2026-06-10',
    category: '지원사업 정보',
    content: '세종로컬창업가협회에서는 세종시에서 활동 중인 로컬 크리에이터 및 소상공인들의 브랜드 스토리를 기록하고 널리 알리는 아카이빙 등록 사업을 진행하고 있습니다. 많은 관심과 참여 바랍니다.'
  }
];

export default function NoticePage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [activeNoticeId, setActiveNoticeId] = useState(null);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subbed, setSubbed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !name) return;
    setSubbed(true);
  };

  const toggleNotice = (id) => {
    setActiveNoticeId(activeNoticeId === id ? null : id);
  };

  const categories = ['전체', '정기행사 안내', '세로데이 모집', '교육 안내', '지원사업 정보', '공모전 정보'];

  const filteredNotices = selectedCategory === '전체'
    ? MOCK_NOTICES
    : MOCK_NOTICES.filter(notice => notice.category === selectedCategory);

  return (
    <div className="notice-page-wrapper container" style={{ marginTop: '100px' }}>
      <div className="notice-header">
        <span className="badge badge-apply">Notice & News</span>
        <h2>협회 공지</h2>
        <p>정기행사 안내, 세로데이 모집 소식, 역량 강화 교육 일정, 그리고 지원사업 및 공모전 정보를 신속하게 전해드립니다.</p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '20px' }}>
        {categories.map((cat, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setSelectedCategory(cat); setActiveNoticeId(null); }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--border-radius-full)',
              fontSize: '13px',
              fontWeight: '700',
              border: '1px solid var(--color-gray-light)',
              background: selectedCategory === cat ? 'var(--color-emerald-deep)' : 'var(--color-white)',
              color: selectedCategory === cat ? 'var(--color-white)' : 'var(--color-gray-dark)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="notice-layout">
        {/* Left: Accordion Notices */}
        <div className="notices-panel glass-panel">
          <h3 className="panel-title">📢 공지사항 및 공고 현황 ({filteredNotices.length})</h3>
          <div className="accordion-list">
            {filteredNotices.map((notice) => (
              <div 
                key={notice.id} 
                className={`accordion-item ${activeNoticeId === notice.id ? 'open' : ''}`}
              >
                <button 
                  type="button" 
                  className="accordion-trigger" 
                  onClick={() => toggleNotice(notice.id)}
                >
                  <div className="notice-title-row">
                    <span className="notice-category">{notice.category}</span>
                    <span className="notice-title-text">{notice.title}</span>
                  </div>
                  <div className="notice-meta-row">
                    <span className="notice-date">{notice.date}</span>
                    <span className="accordion-arrow">{activeNoticeId === notice.id ? '▲' : '▼'}</span>
                  </div>
                </button>
                
                {activeNoticeId === notice.id && (
                  <div className="accordion-content animate-fade-in">
                    <p>{notice.content}</p>
                  </div>
                )}
              </div>
            ))}
            {filteredNotices.length === 0 && (
              <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-gray-medium)', fontWeight: 'bold' }}>
                해당 카테고리에 등록된 공지사항이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* Right: Newsletter Sidebar */}
        <div className="newsletter-sidebar glass-panel">
          <h3 className="sidebar-title">📩 뉴스레터 무료 구독</h3>
          <p className="sidebar-desc">
            세종 로컬 트렌드와 알찬 교육/네트워킹 행사 소식을 편하게 이메일로 받아보세요.
          </p>
          
          {subbed ? (
            <div className="sub-success-box">
              <h4>🎉 구독 완료!</h4>
              <p>감사합니다, {name}님! 매주 목요일 아침에 메일함으로 찾아가겠습니다.</p>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="form-group">
                <label htmlFor="news-name">이름</label>
                <input
                  id="news-name"
                  type="text"
                  required
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="news-email">이메일 주소</label>
                <input
                  id="news-email"
                  type="email"
                  required
                  placeholder="example@sejong.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="subscribe-btn">
                구독하기
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .notice-page-wrapper {
          padding-top: 40px;
          padding-bottom: 100px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .notice-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 2px solid var(--color-emerald-deep);
          padding-bottom: 16px;
        }

        .notice-header h2 {
          font-size: 28px;
          color: var(--color-charcoal-deep);
        }

        .notice-header p {
          font-size: 15px;
          color: var(--color-gray-dark);
        }

        .notice-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        @media (min-width: 1024px) {
          .notice-layout {
            grid-template-columns: 1.3fr 0.7fr;
          }
        }

        .notices-panel {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          padding: 24px;
        }

        .panel-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--color-charcoal-deep);
          margin-bottom: 20px;
          border-bottom: 2px solid var(--color-emerald-deep);
          padding-bottom: 8px;
        }

        .accordion-list {
          display: flex;
          flex-direction: column;
        }

        .accordion-item {
          border-bottom: 1px solid var(--color-gray-light);
        }

        .accordion-item:last-child {
          border-bottom: none;
        }

        .accordion-trigger {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px 8px;
          text-align: left;
          transition: background-color 0.2s ease;
        }

        @media (min-width: 768px) {
          .accordion-trigger {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .accordion-trigger:hover {
          background-color: var(--color-sand-light);
        }

        .notice-title-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .notice-category {
          font-size: 11px;
          font-weight: 700;
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          white-space: nowrap;
        }

        .notice-title-text {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-charcoal-deep);
        }

        .notice-meta-row {
          display: flex;
          gap: 20px;
          align-items: center;
          font-size: 13px;
          color: var(--color-gray-dark);
          align-self: flex-end;
        }

        @media (min-width: 768px) {
          .notice-meta-row {
            align-self: center;
          }
        }

        .accordion-arrow {
          font-size: 10px;
          color: var(--color-gray-medium);
        }

        .accordion-content {
          padding: 20px 16px;
          background-color: var(--color-sand-light);
          font-size: 14.5px;
          line-height: 1.7;
          color: var(--color-gray-dark);
          border-radius: var(--border-radius-sm);
          margin-bottom: 20px;
        }

        .newsletter-sidebar {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: fit-content;
        }

        .sidebar-title {
          font-size: 16px;
          font-weight: 800;
          border-bottom: 2px solid var(--color-emerald-deep);
          padding-bottom: 8px;
        }

        .sidebar-desc {
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--color-gray-dark);
        }

        .sub-success-box {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
          padding: 20px;
          border-radius: var(--border-radius-md);
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }

        .sub-success-box h4 {
          font-size: 16px;
          font-weight: 800;
        }

        .sub-success-box p {
          font-size: 13px;
          line-height: 1.5;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }

        .form-group input {
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          padding: 12px;
          outline: none;
          font-size: 14px;
          font-weight: 600;
          background-color: var(--color-sand-light);
        }

        .form-group input:focus {
          border-color: var(--color-emerald-deep);
          background-color: var(--color-white);
        }

        .subscribe-btn {
          height: 48px;
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          font-size: 14px;
          font-weight: 700;
          border-radius: var(--border-radius-sm);
          transition: background-color 0.2s ease;
          margin-top: 10px;
        }

        .subscribe-btn:hover {
          background-color: var(--color-emerald-medium);
        }
      `}</style>
    </div>
  );
}
