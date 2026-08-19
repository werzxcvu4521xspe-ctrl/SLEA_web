'use client';

import Link from 'next/link';

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = prompt('SELO 뉴스레터를 구독할 이메일 주소를 입력해 주세요:');
    if (email === null) return; // cancel
    if (!email.trim() || !email.includes('@')) {
      alert('올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    
    // Simulating newsletter storage
    try {
      const stored = JSON.parse(localStorage.getItem('sejong_newsletter_emails') || '[]');
      const targetEmail = email.trim().toLowerCase();
      if (stored.includes(targetEmail)) {
        alert('이미 구독되어 있는 이메일 주소입니다.');
        return;
      }
      stored.push(targetEmail);
      localStorage.setItem('sejong_newsletter_emails', JSON.stringify(stored));
      alert('구독해 주셔서 감사합니다! 매월 엄선된 세종 로컬 소식을 전해 드릴게요.');
    } catch {
      alert('구독 처리 도중 오류가 발생했습니다.');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Row 1: 3 Link Cards (AD/Business, Join, Talk) */}
        <div className="footer-row-one">
          <div className="link-card">
            <h4 className="en-title uppercase-orange">AD & BUSINESS</h4>
            <h3 className="card-title">광고 · 협업 문의</h3>
            <p className="card-desc">크리에이터와 브랜드의 다양한 제안을 환영합니다.</p>
            <Link href="/partnership" className="footer-action-btn">
              문의하기
            </Link>
          </div>

          <div className="link-card">
            <h4 className="en-title uppercase-orange">JOIN</h4>
            <h3 className="card-title">정회원 가입</h3>
            <p className="card-desc">SELO 회원으로 등록하고 네트워킹, 멘토링, 콘텐츠 혜택을 누려보세요.</p>
            <Link href="/signup" className="footer-action-btn">
              가입하기
            </Link>
          </div>

          <div className="link-card">
            <h4 className="en-title uppercase-orange">TALK</h4>
            <h3 className="card-title">세로 토크</h3>
            <p className="card-desc">자유 게시판, MOU 제안, 콜라보 프로젝트를 한곳에서 확인해 보세요.</p>
            <Link href="/sero-talk" className="footer-action-btn">
              이동하기
            </Link>
          </div>
        </div>

        {/* Row 2: 2 Link Cards (About, Newsletter) */}
        <div className="footer-row-two">
          <div className="link-card">
            <h4 className="en-title uppercase-orange">About</h4>
            <h3 className="card-title">협회 소개</h3>
            <p className="card-desc">세종 로컬 창업 생태계의 다양한 트렌드와 공동 비즈니스, 브랜드 이슈를 SELO에서 만나보세요.</p>
            <Link href="/about" className="footer-action-btn">
              더보기
            </Link>
          </div>

          <div className="link-card">
            <h4 className="en-title uppercase-orange">Newsletter</h4>
            <h3 className="card-title">뉴스레터 구독</h3>
            <p className="card-desc">로컬 비즈니스 트렌드 소식부터 회원사 혜택, 행사 소식까지 엄선해 전해 드립니다.</p>
            <button onClick={handleSubscribe} className="footer-action-btn text-button">
              구독하기
            </button>
          </div>
        </div>

        {/* Association Details */}
        <div className="footer-info-row">
          <div className="info-left">
            <ul className="meta-links">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/notice">공지사항</Link>
              </li>
              <li>
                <Link href="/terms">이용약관</Link>
              </li>
              <li>
                <Link href="/privacy" className="privacy-policy">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
            <div className="details-text">
              <p>세종로컬창업가협회 (Sejong Local Entrepreneur Association)</p>
              <p>사무국: 세종 로컬 창업가 네트워크 운영팀 | 소재지: 세종특별자치시 일대</p>
              <p>이메일: contact@sejonglocal.org | 제휴·회원 문의는 문의하기 페이지를 이용해 주세요.</p>
            </div>
            <p className="copyright">
              © {new Date().getFullYear()} SELO. All rights reserved. 본 사이트의 무단 전재 및 배포를 금합니다.
            </p>
          </div>
          
          <div className="info-right">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="insta-link"
              aria-label="인스타그램 바로가기"
            >
              📸 Instagram
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: #111115;
          color: var(--color-white);
          padding: 80px 0 40px 0;
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-row-one {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 50px;
          margin-bottom: 50px;
        }

        .footer-row-two {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 50px;
          margin-bottom: 40px;
        }

        @media (min-width: 768px) {
          .footer-row-one {
            grid-template-columns: repeat(3, 1fr);
          }
          .footer-row-two {
            grid-template-columns: repeat(2, 1fr);
            gap: 60px;
          }
        }

        .link-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .uppercase-orange {
          font-size: 11px;
          font-weight: 800;
          color: #f2542d;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin: 0;
        }

        .card-title {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .card-desc {
          font-size: 13.5px;
          line-height: 1.6;
          color: #a1a1aa;
          margin: 0 0 10px 0;
        }

        .footer-action-btn {
          display: inline-block;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          background-color: #27272a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 24px;
          border-radius: 4px;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .footer-action-btn:hover {
          background-color: #3f3f46;
          border-color: rgba(255, 255, 255, 0.15);
        }

        .text-button {
          font-family: inherit;
          text-align: left;
        }

        .footer-info-row {
          display: flex;
          flex-direction: column;
          gap: 30px;
          justify-content: space-between;
        }

        @media (min-width: 768px) {
          .footer-info-row {
            flex-direction: row;
            align-items: flex-end;
          }
        }

        .info-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .meta-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .meta-links a {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-gray-medium);
          transition: color 0.2s ease;
        }

        .meta-links a:hover {
          color: var(--color-white);
        }

        .meta-links a.privacy-policy {
          color: var(--color-gray-light);
        }

        .details-text {
          font-size: 13px;
          line-height: 1.6;
          color: var(--color-gray-dark);
        }

        .copyright {
          font-size: 12px;
          color: var(--color-gray-dark);
          margin-top: 10px;
        }

        .info-right .insta-link {
          display: inline-block;
          font-size: 14px;
          font-weight: 700;
          color: var(--color-sand-medium);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 10px 20px;
          border-radius: var(--border-radius-full);
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .info-right .insta-link:hover {
          background-color: var(--color-white);
          color: var(--color-charcoal-medium);
        }
      `}</style>
    </footer>
  );
}
