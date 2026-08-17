'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getMemberContent, MEMBER_CONTENTS } from '@/lib/memberContents';

export default function MemberContentDetailPage() {
  const params = useParams();
  const content = getMemberContent(String(params.id));

  if (!content) {
    return (
      <main className="member-detail-page">
        <section className="member-not-found container">
          <span>Member Stories</span>
          <h1>콘텐츠를 찾을 수 없습니다.</h1>
          <p>삭제되었거나 잘못된 주소입니다. 세로 회원사 페이지에서 다른 콘텐츠를 확인해 주세요.</p>
          <Link href="/sero-members" className="detail-solid-btn">세로 회원사로 돌아가기</Link>
        </section>

        <style jsx>{`
          .member-detail-page {
            min-height: 100vh;
            background: #ffffff;
            color: #161616;
          }

          .member-not-found {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 18px;
            padding: 180px 20px 96px;
          }

          .member-not-found span {
            color: #ff5a2a;
            font-weight: 900;
          }

          .member-not-found h1 {
            font-size: clamp(34px, 7vw, 72px);
            font-weight: 900;
          }

          .member-not-found p {
            max-width: 560px;
            color: #525252;
            line-height: 1.75;
          }

          .detail-solid-btn {
            min-height: 48px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 18px;
            background: #ff5a2a;
            color: #ffffff;
            font-weight: 900;
          }
        `}</style>
      </main>
    );
  }

  const relatedContents = MEMBER_CONTENTS
    .filter((item) => item.id !== content.id)
    .slice(0, 3);

  return (
    <article className="member-detail-page">
      <header className="member-detail-hero">
        <div className="container detail-hero-inner">
          <Link href="/sero-members" className="back-link">← 세로 회원사</Link>
          <div className="detail-meta-row">
            <span>{content.type}</span>
            <time dateTime={content.date}>{content.date}</time>
          </div>
          <h1>{content.title}</h1>
          <p>{content.story}</p>
          <span className="detail-author">by {content.brand}</span>
        </div>
      </header>

      <main className="member-detail-main container">
        <figure className="detail-cover">
          <img src={content.image} alt={`${content.title} 대표 이미지`} />
        </figure>

        <section className="blog-body">
          <div className="content-info-grid">
            <div>
              <span>Channel</span>
              <strong>{content.channel}</strong>
            </div>
            <div>
              <span>Brand</span>
              <strong>{content.brand}</strong>
            </div>
            <div>
              <span>Type</span>
              <strong>{content.type}</strong>
            </div>
          </div>

          {content.content.map((paragraph, index) => (
            <p key={`${content.id}-${index}`}>{paragraph}</p>
          ))}

          <a className="origin-link" href={content.url} target="_blank" rel="noreferrer">
            원본 콘텐츠 열기 ↗
          </a>
        </section>

        {relatedContents.length > 0 && (
          <aside className="related-section">
            <div className="related-heading">
              <span>More Member Stories</span>
              <h2>다른 회원사 콘텐츠</h2>
            </div>
            <div className="related-grid">
              {relatedContents.map((item) => (
                <Link key={item.id} href={`/sero-members/${item.id}`} className="related-card">
                  <img src={item.image} alt={`${item.title} 썸네일`} />
                  <span>{item.type}</span>
                  <strong>{item.title}</strong>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>

      <style jsx>{`
        .member-detail-page {
          min-height: 100vh;
          background: #ffffff;
          color: #161616;
        }

        .member-detail-hero {
          margin-top: 120px;
          background: #161616;
          color: #ffffff;
        }

        .detail-hero-inner {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          gap: 18px;
          padding-top: 82px;
          padding-bottom: 58px;
        }

        .back-link {
          color: #d7d7d7;
          font-size: 14px;
          font-weight: 900;
          border-bottom: 1px solid rgba(255, 255, 255, 0.42);
          padding-bottom: 4px;
        }

        .detail-meta-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          color: #d7d7d7;
          font-size: 14px;
          font-weight: 900;
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          padding-bottom: 14px;
        }

        .detail-meta-row span {
          color: #ff5a2a;
        }

        .member-detail-hero h1 {
          max-width: 980px;
          color: #ffffff;
          font-family: var(--font-family-condensed);
          font-size: clamp(42px, 7vw, 92px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: 0;
        }

        .member-detail-hero p {
          max-width: 720px;
          color: #d7d7d7;
          font-size: 18px;
          line-height: 1.7;
          word-break: keep-all;
        }

        .detail-author {
          color: #8d8d8d;
          font-size: 14px;
          font-weight: 900;
        }

        .member-detail-main {
          padding: 42px 20px 110px;
        }

        .detail-cover {
          width: 100%;
          overflow: hidden;
          background: #f6f6f6;
          margin-bottom: 44px;
        }

        .detail-cover img {
          width: 100%;
          aspect-ratio: 16 / 9;
          display: block;
          object-fit: cover;
        }

        .blog-body {
          max-width: 820px;
          margin: 0 auto;
          padding-bottom: 72px;
          border-bottom: 1px solid #e0e0e0;
        }

        .content-info-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 36px;
        }

        .content-info-grid div {
          border: 1px solid #e0e0e0;
          padding: 16px;
        }

        .content-info-grid span {
          display: block;
          margin-bottom: 6px;
          color: #ff5a2a;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .content-info-grid strong {
          color: #161616;
          font-size: 16px;
          font-weight: 900;
        }

        .blog-body p {
          color: #383838;
          font-size: 18px;
          line-height: 2;
          word-break: keep-all;
          white-space: pre-line;
        }

        .blog-body p + p {
          margin-top: 24px;
        }

        .origin-link {
          min-height: 48px;
          margin-top: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          background: #ff5a2a;
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
        }

        .related-section {
          padding-top: 56px;
        }

        .related-heading {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .related-heading span,
        .related-card span {
          color: #ff5a2a;
          font-size: 13px;
          font-weight: 900;
        }

        .related-heading h2 {
          color: #161616;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 22px;
        }

        .related-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: #161616;
        }

        .related-card img {
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          background: #f6f6f6;
        }

        .related-card strong {
          font-size: 18px;
          font-weight: 900;
          line-height: 1.35;
        }

        @media (min-width: 768px) {
          .content-info-grid,
          .related-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .member-detail-hero {
            margin-top: 92px;
          }

          .detail-hero-inner {
            min-height: 360px;
            padding-bottom: 40px;
          }

          .detail-meta-row {
            flex-direction: column;
          }

          .member-detail-hero p,
          .blog-body p {
            font-size: 16px;
          }
        }
      `}</style>
    </article>
  );
}
