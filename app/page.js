'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { DEFAULT_NOTICES, NOTICE_STORAGE_KEY } from '@/lib/notices';
import { DEFAULT_SERO_DAY_PROGRAMS } from '@/lib/seroDayPrograms';
import { MEMBER_CONTENTS } from '@/lib/memberContents';

// Mock defaults for Sero Talk
const DEFAULT_TALK_POSTS = [
  { id: 1, type: '자유 게시판', title: '8월 팝업 행사 같이 나갈 F&B 브랜드를 찾습니다.', author: '도원' },
  { id: 2, type: 'MOU 제안', title: '대학 창업동아리와 회원사 현장실습 연계를 제안합니다.', author: '운영팀' },
  { id: 3, type: '콜라보 프로젝트', title: '세종 복숭아 시즌 공동 패키지 프로젝트 모집', author: '브루어리' }
];

export default function HomePage() {
  const [notices, setNotices] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [talkPosts, setTalkPosts] = useState([]);

  useEffect(() => {
    // 1. Load notices
    const storedNotices = localStorage.getItem(NOTICE_STORAGE_KEY);
    if (storedNotices) {
      try {
        setNotices(JSON.parse(storedNotices));
      } catch {
        setNotices(DEFAULT_NOTICES);
      }
    } else {
      setNotices(DEFAULT_NOTICES);
    }

    // 2. Load programs
    const storedPrograms = localStorage.getItem('sejong_sero_programs');
    if (storedPrograms) {
      try {
        setPrograms(JSON.parse(storedPrograms));
      } catch {
        setPrograms(DEFAULT_SERO_DAY_PROGRAMS);
      }
    } else {
      setPrograms(DEFAULT_SERO_DAY_PROGRAMS);
    }

    // 3. Load talk posts
    const storedTalk = localStorage.getItem('sejong_sero_service_sero-talk');
    if (storedTalk) {
      try {
        setTalkPosts(JSON.parse(storedTalk));
      } catch {
        setTalkPosts(DEFAULT_TALK_POSTS);
      }
    } else {
      setTalkPosts(DEFAULT_TALK_POSTS);
    }
  }, []);

  // Display limits
  const latestNotices = notices.slice(0, 3);
  const latestPrograms = programs.slice(0, 3);
  const memberPreview = MEMBER_CONTENTS.slice(0, 4);
  const latestTalks = talkPosts.slice(0, 3);

  return (
    <div className="home-page-container">
      <HeroSlider />

      {/* 1. 공지사항 미리보기 및 더보기 */}
      <section className="home-section notice-preview-section">
        <div className="container">
          <div className="section-header">
            <div className="title-area">
              <span className="section-eyebrow">NOTICE</span>
              <h2 className="section-title">공지사항</h2>
              <p className="section-desc">세종로컬창업가협회의 주요 소식과 이벤트 일정을 안내드립니다.</p>
            </div>
            <Link href="/notice" className="more-link">
              더보기 <span className="arrow">→</span>
            </Link>
          </div>

          <div className="preview-grid notice-grid">
            {latestNotices.map((notice) => (
              <Link href={`/notice/${notice.id}`} key={notice.id} className="preview-card notice-card glass-panel">
                <div className="card-image-wrap">
                  <img 
                    src={notice.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600'} 
                    alt={notice.title} 
                    className="card-image"
                    loading="lazy"
                  />
                  {notice.pinned && <span className="card-badge pin-badge">중요</span>}
                  <span className="card-badge category-badge">{notice.category}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title text-ellipsis">{notice.title}</h3>
                  <p className="card-excerpt text-ellipsis-2">{notice.excerpt || notice.content}</p>
                  <div className="card-meta">
                    <span className="meta-item author">{notice.author || '사무국'}</span>
                    <span className="meta-item date">{notice.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 세로데이 프로그램 미리보기 및 더보기 */}
      <section className="home-section program-preview-section">
        <div className="container">
          <div className="section-header">
            <div className="title-area">
              <span className="section-eyebrow">SERO DAY</span>
              <h2 className="section-title">세로데이 프로그램</h2>
              <p className="section-desc">협회 회원사와 크리에이터가 직접 주최하고 함께하는 참여 프로그램입니다.</p>
            </div>
            <Link href="/sero-day" className="more-link">
              더보기 <span className="arrow">→</span>
            </Link>
          </div>

          <div className="preview-grid program-grid">
            {latestPrograms.map((prog) => (
              <Link href="/sero-day" key={prog.id} className="preview-card program-card glass-panel">
                <div className="card-image-wrap">
                  <img 
                    src={prog.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600'} 
                    alt={prog.title} 
                    className="card-image"
                    loading="lazy"
                  />
                  <span className={`card-badge status-badge ${prog.status === 'recruiting' ? 'recruiting' : 'closed'}`}>
                    {prog.status === 'recruiting' ? '모집중' : '마감'}
                  </span>
                </div>
                <div className="card-body">
                  <span className="program-type">{prog.type}</span>
                  <h3 className="card-title text-ellipsis">{prog.title}</h3>
                  <p className="card-excerpt text-ellipsis-2">{prog.summary}</p>
                  <div className="program-details">
                    <div className="detail-row">
                      <span className="label">일시</span>
                      <span className="value">{prog.date}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">장소</span>
                      <span className="value">{prog.place}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 세로 회원사 미리보기 */}
      <section className="home-section members-preview-section">
        <div className="container">
          <div className="section-header">
            <div className="title-area">
              <span className="section-eyebrow">MEMBERS</span>
              <h2 className="section-title">세로 회원사</h2>
              <p className="section-desc">협회와 함께 발전을 도모하고 있는 세종시 로컬 브랜드 크리에이터들입니다.</p>
            </div>
            <Link href="/sero-members" className="more-link">
              더보기 <span className="arrow">→</span>
            </Link>
          </div>

          <div className="preview-grid members-grid">
            {memberPreview.map((member) => (
              <Link href={`/sero-members/${member.id}`} key={member.id} className="preview-card member-card glass-panel">
                <div className="card-image-wrap">
                  <img 
                    src={member.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600'} 
                    alt={member.brand} 
                    className="card-image"
                    loading="lazy"
                  />
                  <span className="card-badge type-badge">{member.type}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title brand-name">{member.brand}</h3>
                  <p className="card-excerpt text-ellipsis-2">{member.title}</p>
                  <p className="member-story text-ellipsis-2">{member.story}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI 사업계획서 만들기 CTA 배너 */}
      <section className="home-cta-section ai-start-cta">
        <div className="container">
          <div className="cta-banner glass-panel animate-fade-in">
            <div className="cta-content">
              <span className="cta-eyebrow">SELO AI START</span>
              <h2 className="cta-title">로컬 창업가를 위한<br />AI 사업계획서 생성기</h2>
              <p className="cta-desc">
                사업 아이디어와 타겟 고객 설정만으로 5분 만에 기획 초안을 설계해 보세요.<br />
                세종로컬창업가협회가 창업가의 첫걸음을 혁신 기술로 돕습니다.
              </p>
              <Link href="/sero-ai-start" className="cta-button primary-cta-btn">
                세로AI 스타트 시작하기 <span className="arrow">→</span>
              </Link>
            </div>
            <div className="cta-visual">
              <div className="visual-card glass-panel">
                <span className="tech-badge">AI Assistant</span>
                <h3>기획서 초안 생성율 100%</h3>
                <p>세종시 지역 특화 비즈니스 데이터가 모델링에 반영되었습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 멘토링 데이 바로가기 CTA 배너 */}
      <section className="home-cta-section mentoring-cta">
        <div className="container">
          <div className="cta-banner gradient-dark glass-panel animate-fade-in">
            <div className="cta-content">
              <span className="cta-eyebrow">MENTORING DAY</span>
              <h2 className="cta-title">분야별 검증된 전문가와<br />1:1 로컬 비즈니스 멘토링</h2>
              <p className="cta-desc">
                브랜딩, 세무/회계, 판로 개척, 정부 지원사업 매칭까지.<br />
                지금 필요한 전문 지식을 무료로 매칭 받고 고민을 해결해 보세요.
              </p>
              <Link href="/mentoring-day" className="cta-button secondary-cta-btn">
                멘토링 데이 바로가기 <span className="arrow">→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 6. 세로 토크 미리보기 */}
      <section className="home-section talk-preview-section">
        <div className="container">
          <div className="section-header">
            <div className="title-area">
              <span className="section-eyebrow">SERO TALK</span>
              <h2 className="section-title">세로 토크</h2>
              <p className="section-desc">회원사 간의 실시간 비즈니스 협업 제안과 편안한 소통이 오가는 공간입니다.</p>
            </div>
            <Link href="/sero-talk" className="more-link">
              더보기 <span className="arrow">→</span>
            </Link>
          </div>

          <div className="preview-grid talk-grid">
            {latestTalks.map((post) => (
              <Link href="/sero-talk" key={post.id} className="preview-card talk-card glass-panel">
                <div className="card-body">
                  <span className="talk-type-badge">{post.type}</span>
                  <h3 className="card-title talk-title">{post.title}</h3>
                  <div className="talk-meta">
                    <span className="author">작성자: {post.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .home-page-container {
          background-color: var(--color-sand-light);
          padding-bottom: 80px;
        }

        .home-section {
          padding: 80px 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding-bottom: 20px;
        }

        .title-area {
          max-width: 600px;
        }

        .section-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: var(--color-orange-accent);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--color-charcoal-deep);
          margin: 0 0 10px 0;
          letter-spacing: -0.02em;
        }

        .section-desc {
          font-size: 15px;
          color: var(--color-gray-dark);
          margin: 0;
          line-height: 1.5;
        }

        .more-link {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-charcoal-deep);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 20px;
          background-color: rgba(0, 0, 0, 0.03);
          transition: all var(--transition-smooth);
          white-space: nowrap;
        }

        .more-link:hover {
          background-color: var(--color-charcoal-deep);
          color: var(--color-white);
        }

        .more-link:hover .arrow {
          transform: translateX(4px);
        }

        .more-link .arrow {
          transition: transform var(--transition-smooth);
        }

        /* Preview Grids */
        .preview-grid {
          display: grid;
          gap: 30px;
        }

        .notice-grid, .program-grid {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }

        .members-grid {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .talk-grid {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        /* Preview Cards */
        .preview-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          background: var(--color-white);
          border-radius: var(--border-radius-md);
          border: 1px solid rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .preview-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          border-color: rgba(242, 84, 45, 0.2);
        }

        .card-image-wrap {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          overflow: hidden;
          background-color: #eee;
        }

        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .preview-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-badge {
          position: absolute;
          font-size: 10.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 4px;
          color: var(--color-white);
        }

        .pin-badge {
          top: 12px;
          left: 12px;
          background-color: var(--color-orange-accent);
          z-index: 2;
        }

        .category-badge {
          bottom: 12px;
          left: 12px;
          background-color: rgba(0, 0, 0, 0.7);
        }

        .status-badge {
          top: 12px;
          right: 12px;
        }

        .status-badge.recruiting {
          background-color: #10b981;
        }

        .status-badge.closed {
          background-color: #9ca3af;
        }

        .type-badge {
          top: 12px;
          left: 12px;
          background-color: var(--color-charcoal-deep);
        }

        .card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--color-charcoal-deep);
          margin: 0 0 10px 0;
          line-height: 1.4;
          transition: color 0.2s ease;
        }

        .preview-card:hover .card-title {
          color: var(--color-orange-accent);
        }

        .card-excerpt {
          font-size: 13.5px;
          color: var(--color-gray-dark);
          line-height: 1.5;
          margin: 0 0 20px 0;
          flex-grow: 1;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 12px;
          margin-top: auto;
        }

        .program-type {
          font-size: 11px;
          font-weight: 800;
          color: var(--color-orange-accent);
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        .program-details {
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12.5px;
          margin-top: auto;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
        }

        .detail-row .label {
          color: #999;
          font-weight: 600;
        }

        .detail-row .value {
          color: var(--color-charcoal-deep);
          font-weight: 700;
        }

        .brand-name {
          font-size: 19px;
          margin-bottom: 6px;
        }

        .member-story {
          font-size: 12.5px;
          color: #888;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          padding-top: 10px;
          margin: 0;
          font-style: italic;
        }

        /* Banners (CTA) */
        .home-cta-section {
          padding: 40px 0;
        }

        .cta-banner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          padding: 60px;
          border-radius: var(--border-radius-lg);
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: var(--color-white);
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 992px) {
          .cta-banner {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }

        .gradient-dark {
          background: linear-gradient(135deg, #1e1e24 0%, #111115 100%);
          border-color: rgba(255, 255, 255, 0.05);
          color: var(--color-white);
        }

        .cta-content {
          z-index: 2;
        }

        .cta-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: var(--color-orange-accent);
          margin-bottom: 12px;
        }

        .cta-title {
          font-size: 34px;
          font-weight: 900;
          line-height: 1.25;
          margin: 0 0 20px 0;
          letter-spacing: -0.02em;
          word-break: keep-all;
        }

        .gradient-dark .cta-title {
          color: var(--color-white);
        }

        .cta-desc {
          font-size: 15.5px;
          line-height: 1.6;
          color: var(--color-gray-dark);
          margin: 0 0 35px 0;
        }

        .gradient-dark .cta-desc {
          color: rgba(255, 255, 255, 0.7);
        }

        .cta-button {
          display: inline-block;
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border-radius: 30px;
          transition: all var(--transition-smooth);
        }

        .primary-cta-btn {
          background-color: var(--color-orange-accent);
          color: var(--color-white);
        }

        .primary-cta-btn:hover {
          background-color: var(--color-charcoal-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(242, 84, 45, 0.25);
        }

        .secondary-cta-btn {
          background-color: var(--color-white);
          color: var(--color-charcoal-deep);
        }

        .secondary-cta-btn:hover {
          background-color: var(--color-orange-accent);
          color: var(--color-white);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1);
        }

        .cta-visual {
          display: flex;
          justify-content: center;
          z-index: 2;
        }

        .visual-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 30px;
          border-radius: var(--border-radius-md);
          max-width: 320px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }

        .tech-badge {
          display: inline-block;
          font-size: 9.5px;
          font-weight: 800;
          background-color: var(--color-charcoal-deep);
          color: var(--color-white);
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .visual-card h3 {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: var(--color-charcoal-deep);
        }

        .visual-card p {
          font-size: 12.5px;
          color: var(--color-gray-dark);
          margin: 0;
          line-height: 1.4;
        }

        .cta-visual-simple {
          position: absolute;
          right: -50px;
          top: -50px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(242, 84, 45, 0.15) 0%, transparent 70%);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .highlight-tag {
          font-size: 13px;
          font-weight: 800;
          color: var(--color-orange-accent);
          letter-spacing: 0.1em;
          transform: rotate(45deg);
          border: 1px solid var(--color-orange-accent);
          padding: 6px 20px;
          border-radius: 4px;
          background: rgba(242, 84, 45, 0.05);
        }

        /* Talk preview */
        .talk-card {
          padding: 30px;
        }

        .talk-type-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          color: var(--color-white);
          background-color: var(--color-orange-accent);
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .talk-title {
          font-size: 16.5px;
          font-weight: 800;
          line-height: 1.4;
          margin: 0 0 16px 0;
        }

        .talk-meta {
          font-size: 12px;
          color: #999;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          padding-top: 10px;
        }

        /* Ellipsis helpers */
        .text-ellipsis {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-ellipsis-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Mobile Responsive Patches */
        @media (max-width: 768px) {
          .home-section {
            padding: 48px 0;
          }

          .section-header {
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            gap: 12px;
          }

          .section-title {
            font-size: 24px;
            margin-bottom: 6px;
          }

          .section-desc {
            font-size: 13px;
            line-height: 1.45;
          }

          .more-link {
            font-size: 12px;
            padding: 6px 12px;
          }

          .cta-banner {
            padding: 36px 20px;
            gap: 28px;
          }

          .cta-title {
            font-size: 22px;
            line-height: 1.35;
          }

          .cta-desc {
            font-size: 13.5px;
            margin-bottom: 22px;
            line-height: 1.5;
          }

          .cta-button {
            padding: 12px 24px;
            font-size: 13.5px;
            width: 100%;
            text-align: center;
          }

          .visual-card {
            padding: 20px;
            max-width: 100%;
          }
        }
      ` }} />
    </div>
  );
}
