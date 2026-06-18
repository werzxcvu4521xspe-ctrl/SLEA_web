'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Top Link Cards */}
        <div className="footer-links-grid">
          <div className="link-card">
            <h4 className="en-title">AD & BUSINESS</h4>
            <div className="card-desc">
              <span className="bold-label">제휴 및 광고 문의</span>
              세종시 로컬 브랜드 활성화를 위한 대외 기관 및 기업들의 제안을 환영합니다.
            </div>
            <Link href="/proposal" className="card-action-btn">
              문의하기 →
            </Link>
          </div>

          <div className="link-card">
            <h4 className="en-title">NEWS & STORY</h4>
            <div className="card-desc">
              <span className="bold-label">로컬 창업 스토리 제보</span>
              세종시에서 전하고 싶은 재미있는 창업 소식이나 브랜드 오픈 정보가 있다면 제보해 주세요.
            </div>
            <Link href="/notice" className="card-action-btn">
              제보하기 →
            </Link>
          </div>

          <div className="link-card">
            <h4 className="en-title">ARCHIVING</h4>
            <div className="card-desc">
              <span className="bold-label">창업 정보 등록 신청</span>
              세종로컬창업가협회의 일원이 되어 브랜드 가치를 널리 알리고 협회 네트워킹에 참여하세요.
            </div>
            <Link href="/mypage" className="card-action-btn">
              신청하기 →
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
              <p>대표자: 홍길동 | 소재지: 세종특별자치시 나성로 123 세종로컬허브 3층</p>
              <p>이메일: contact@sejonglocal.org | 문의전화: 044-123-4567</p>
            </div>
            <p className="copyright">
              © {new Date().getFullYear()} SEJONG LOCAL. All rights reserved. 본 사이트의 무단 전재 및 배포를 금합니다.
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
