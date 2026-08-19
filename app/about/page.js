import Link from 'next/link';

const actionCards = [
  {
    label: 'NOTICE',
    title: '공지사항',
    desc: '협회 공지, 활동 소식, 행사 모집과 지원사업 안내를 확인합니다.',
    action: '확인하기',
    href: '/notice'
  },
  {
    label: 'JOIN',
    title: '정회원 가입',
    desc: 'SELO 회원으로 등록하고 네트워킹, 멘토링, 콘텐츠 지원을 시작합니다.',
    action: '가입하기',
    href: '/signup'
  },
  {
    label: 'TALK',
    title: '세로 토크',
    desc: '자유 게시판, MOU 제안, 콜라보 프로젝트를 한곳에서 연결합니다.',
    action: '이동하기',
    href: '/sero-talk'
  }
];

const infoCards = [
  {
    label: 'AD & BUSINESS',
    title: '협업 및 광고 문의',
    desc: '로컬 창업가와 브랜드를 연결하는 캠페인, 공동 프로젝트, 제휴 제안을 환영합니다.',
    action: '문의하기',
    href: '/proposal'
  },
  {
    label: 'NOW',
    title: '콘텐츠 제보',
    desc: '인터뷰, 팝업, 전시, 신제품, 지역 협업 소식을 SELO 채널에 제보해 주세요.',
    action: '제보하기',
    href: '/sero-talk'
  },
  {
    label: 'PLACE',
    title: '로컬 창업 정보 등록 신청',
    desc: 'SELO에 소개하고 싶은 회원사, 상품, 공간, 프로젝트 정보를 등록합니다.',
    action: '신청하기',
    href: '/mypage'
  }
];

export const metadata = {
  title: 'About SELO | 세종로컬창업가협회',
  description: '세종 로컬 창업가 네트워크 SELO의 소개와 주요 연결 채널을 안내합니다.'
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-container">
          <p className="eyebrow">ABOUT SELO</p>
          <h1>
            세종의 로컬 창업가가
            <br />
            서로를 찾고, 협업하고,
            <br />
            더 멀리 알려지는 플랫폼
          </h1>
          <p className="hero-copy">
            SELO는 세종의 창업가, 소상공인, 크리에이터, 기관 파트너가 서로의 소식과 자원을
            연결하는 로컬 비즈니스 네트워크입니다.
          </p>
        </div>
      </section>

      <section className="about-actions">
        <div className="about-container action-grid">
          {actionCards.map((card) => (
            <Link key={card.label} href={card.href} className="action-card">
              <span>{card.label}</span>
              <strong>{card.title}</strong>
              <p>{card.desc}</p>
              <em>{card.action} →</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-story">
        <div className="about-container story-grid">
          <div>
            <p className="eyebrow">WHAT WE DO</p>
            <h2>지역 안에서 시작한 브랜드가 시장과 연결되는 과정을 돕습니다.</h2>
          </div>
          <div className="story-copy">
            <p>
              공지, 네트워킹 데이, 회원사 콘텐츠, AI 창업 지원, 멘토링, 쇼핑, 토크 채널을
              하나의 흐름으로 묶어 창업가가 필요한 정보를 더 빨리 찾도록 설계했습니다.
            </p>
            <p>
              SELO는 단순한 소개 페이지가 아니라, 회원사가 자신의 이야기와 상품을 올리고
              협업 제안을 받을 수 있는 운영형 플랫폼을 지향합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="about-info">
        <div className="about-container info-grid">
          {infoCards.map((card) => (
            <Link key={card.label} href={card.href} className="info-card">
              <span>{card.label}</span>
              <strong>{card.title}</strong>
              <p>{card.desc}</p>
              <em>{card.action}</em>
            </Link>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .about-page {
          background: #111111;
          color: #ffffff;
        }

        .about-container {
          width: min(100%, 1440px);
          margin: 0 auto;
          padding: 0 clamp(24px, 5vw, 72px);
        }

        .about-hero {
          padding: clamp(96px, 14vw, 188px) 0 clamp(72px, 10vw, 132px);
        }

        .eyebrow {
          margin-bottom: 24px;
          color: var(--color-orange-accent);
          font-family: var(--font-family-condensed);
          font-size: clamp(16px, 1.4vw, 24px);
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1,
        h2,
        strong {
          font-family: var(--font-family-condensed);
          letter-spacing: 0;
        }

        h1 {
          max-width: 1120px;
          font-size: clamp(48px, 7vw, 112px);
          font-weight: 900;
          line-height: 1.04;
        }

        .hero-copy {
          max-width: 820px;
          margin-top: 36px;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(18px, 1.6vw, 28px);
          font-weight: 600;
          line-height: 1.62;
          word-break: keep-all;
        }

        .about-actions,
        .about-story,
        .about-info {
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .action-grid,
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .action-card,
        .info-card {
          min-height: 300px;
          padding: clamp(32px, 4vw, 58px);
          color: #ffffff;
          border-left: 1px solid rgba(255, 255, 255, 0.14);
          transition: background 0.2s ease, color 0.2s ease;
        }

        .action-card:last-child,
        .info-card:last-child {
          border-right: 1px solid rgba(255, 255, 255, 0.14);
        }

        .action-card:hover,
        .info-card:hover {
          background: #1d1d1d;
        }

        .action-card span,
        .info-card span {
          display: block;
          margin-bottom: 34px;
          color: var(--color-orange-accent);
          font-family: var(--font-family-condensed);
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .action-card strong,
        .info-card strong {
          display: block;
          margin-bottom: 18px;
          font-size: clamp(26px, 2.5vw, 42px);
          font-weight: 900;
          line-height: 1.18;
        }

        .action-card p,
        .info-card p,
        .story-copy p {
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(16px, 1.25vw, 22px);
          font-weight: 600;
          line-height: 1.7;
          word-break: keep-all;
        }

        .action-card em,
        .info-card em {
          display: inline-flex;
          margin-top: 42px;
          padding: 15px 24px;
          background: #242424;
          color: #ffffff;
          font-style: normal;
          font-size: 17px;
          font-weight: 900;
        }

        .story-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: clamp(40px, 8vw, 120px);
          padding-top: clamp(72px, 9vw, 128px);
          padding-bottom: clamp(72px, 9vw, 128px);
        }

        h2 {
          max-width: 780px;
          font-size: clamp(36px, 4.8vw, 76px);
          font-weight: 900;
          line-height: 1.1;
        }

        .story-copy {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding-top: 12px;
        }

        .info-card {
          min-height: 340px;
        }

        @media (max-width: 900px) {
          .action-grid,
          .info-grid,
          .story-grid {
            grid-template-columns: 1fr;
          }

          .action-card,
          .info-card {
            min-height: auto;
            border-left: 0;
            border-right: 0 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          }
        }
      ` }} />
    </main>
  );
}
