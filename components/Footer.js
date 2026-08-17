'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Top Link Cards */}
        <div className="footer-links-grid">
          <div className="link-card">
            <h4 className="en-title">NOTICE</h4>
            <div className="card-desc">
              <span className="bold-label">공지사항</span>
              협회 공지, 활동 소식, 행사 모집과 지원사업 안내를 확인합니다.
            </div>
            <Link href="/notice" className="card-action-btn">
              확인하기 →
            </Link>
          </div>

          <div className="link-card">
            <h4 className="en-title">JOIN</h4>
            <div className="card-desc">
              <span className="bold-label">정회원 가입</span>
              SELO 회원으로 등록하고 네트워킹, 멘토링, 콘텐츠 지원을 시작합니다.
            </div>
            <Link href="/signup" className="card-action-btn">
              가입하기 →
            </Link>
          </div>

          <div className="link-card">
            <h4 className="en-title">TALK</h4>
            <div className="card-desc">
              <span className="bold-label">세로 토크</span>
              자유 게시판, MOU 제안, 콜라보 프로젝트를 한곳에서 연결합니다.
            </div>
            <Link href="/sero-talk" className="card-action-btn">
              이동하기 →
            </Link>
          </div>
        </div>

        {/* Association Details */}
        <div className="footer-info-row">
          <div className="info-left">
            <ul className="meta-links">
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
          background-color: var(--color-charcoal-medium);
          color: var(--color-white);
          padding: 80px 0 40px 0;
          margin-top: auto;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 50px;
          margin-bottom: 40px;
        }

        @media (min-width: 768px) {
          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .link-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .link-card h4 {
          font-size: 13px;
          color: var(--color-emerald-light);
          letter-spacing: 1px;
        }

        .card-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-gray-light);
        }

        .bold-label {
          display: block;
          font-size: 16px;
          font-weight: 700;
          color: var(--color-white);
          margin-bottom: 6px;
        }

        .card-action-btn {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-white);
          border-bottom: 1px solid var(--color-white);
          padding-bottom: 2px;
          margin-top: auto;
          transition: border-color 0.2s ease, color 0.2s ease;
        }

        .card-action-btn:hover {
          color: var(--color-emerald-light);
          border-color: var(--color-emerald-light);
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
