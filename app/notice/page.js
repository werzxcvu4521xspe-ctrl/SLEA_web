'use client';

import { useState } from 'react';

const MOCK_NOTICES = [
  {
    id: 1,
    title: '[공지] 2026년 하반기 세종 로컬 크리에이터 브랜드 아카이빙 등록 접수 안내',
    date: '2026-06-15',
    category: '공지사항',
    content: '세종로컬창업가협회에서는 세종시에서 활동 중인 로컬 크리에이터 및 소상공인들의 브랜드 스토리를 기록하고 널리 알리는 아카이빙 등록 사업을 진행하고 있습니다. 많은 관심과 참여 바랍니다.'
  },
  {
    id: 2,
    title: '[행사] 7월 세종 로컬 창업 네트워킹 데이 & 비즈니스 멘토링 프로그램 참가자 모집',
    date: '2026-06-10',
    category: '행사소식',
    content: '오는 7월 12일 나성동 로컬허브에서 마케팅 및 브랜드 디렉팅 전문가를 초빙하여 로컬 멘토링 데이를 개최합니다. 선착순 20명 모집 마감되오니 마이페이지에서 신청해 주시기 바랍니다.'
  },
  {
    id: 3,
    title: '[뉴스] 세종로컬창업가협회, 조치원 도시재생 청년 기획단과 공식 MOU 체결',
    date: '2026-05-28',
    category: '협회소식',
    content: '세종로컬창업가협회는 지난 27일 조치원읍 양조장 재생 프로젝트 추진단과 지역 청년 일자리 창출 및 로컬 크리에이터 상생 발전을 위한 전략적 업무 협약을 공식적으로 체결하였습니다.'
  }
];

export default function NoticePage() {
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

  return (
    <div className="notice-page-wrapper container">
      <div className="notice-header">
        <span className="badge badge-apply">Notice & News</span>
        <h2>소식 및 공지사항</h2>
        <p>협회 공지사항, 로컬 멘토링 행사 일정, 그리고 세종시 창업 생태계 뉴스를 공유합니다.</p>
      </div>

      <div className="notice-layout">
        {/* Left: Accordion Notices */}
        <div className="notices-panel glass-panel">
          <h3 className="panel-title">📢 최근 공지 소식</h3>
          <div className="accordion-list">
            {MOCK_NOTICES.map((notice) => (
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
