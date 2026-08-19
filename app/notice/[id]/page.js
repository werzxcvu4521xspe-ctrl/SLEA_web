'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import BookmarkButton from '@/components/BookmarkButton';
import {
  DEFAULT_NOTICE_IMAGE,
  DEFAULT_NOTICES,
  NOTICE_STORAGE_KEY,
  normalizeNotice
} from '@/lib/notices';

export default function NoticeDetailPage() {
  const params = useParams();
  const noticeId = String(params.id);
  const [notices, setNotices] = useState(DEFAULT_NOTICES);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedNotices = localStorage.getItem(NOTICE_STORAGE_KEY);
      if (!savedNotices) return;

      try {
        const parsedNotices = JSON.parse(savedNotices);
        if (Array.isArray(parsedNotices) && parsedNotices.length > 0) {
          setNotices(parsedNotices.map(normalizeNotice));
        }
      } catch (error) {
        localStorage.removeItem(NOTICE_STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const notice = useMemo(
    () => notices.find((item) => String(item.id) === noticeId),
    [noticeId, notices]
  );

  const relatedNotices = useMemo(
    () => notices
      .filter((item) => String(item.id) !== noticeId)
      .slice(0, 3),
    [noticeId, notices]
  );

  if (!notice) {
    return (
      <main className="notice-detail-page">
        <section className="notice-not-found container">
          <span>Notice</span>
          <h1>콘텐츠를 찾을 수 없습니다.</h1>
          <p>삭제되었거나 잘못된 주소입니다. 공지 채널에서 다른 콘텐츠를 확인해 주세요.</p>
          <Link href="/notice" className="detail-solid-btn">공지 목록으로 돌아가기</Link>
        </section>

        <style jsx>{`
          .notice-detail-page {
            min-height: 100vh;
            background: #ffffff;
            color: #161616;
          }

          .notice-not-found {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 18px;
            padding: 180px 20px 96px;
          }

          .notice-not-found span {
            color: #ff5a2a;
            font-weight: 900;
          }

          .notice-not-found h1 {
            font-size: clamp(34px, 7vw, 72px);
            font-weight: 900;
          }

          .notice-not-found p {
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

  return (
    <article className="notice-detail-page">
      <header className="notice-detail-hero">
        <div className="container detail-hero-inner">
          <Link href="/notice" className="back-link">← 공지 목록</Link>
          <div className="detail-meta-row">
            <span>{notice.category}</span>
            <time dateTime={notice.date}>{notice.date}</time>
          </div>
          <h1>{notice.title}</h1>
          <p>{notice.excerpt}</p>
          <div className="detail-action-row">
            <span className="detail-author">by {notice.author}</span>
            <BookmarkButton
              item={{
                id: `notice-${notice.id}`,
                type: '공지사항',
                title: notice.title,
                excerpt: notice.excerpt,
                href: `/notice/${notice.id}`,
                imageUrl: notice.imageUrl || DEFAULT_NOTICE_IMAGE
              }}
            />
          </div>
        </div>
      </header>

      <main className="notice-detail-main container">
        <figure className="detail-cover">
          <img src={notice.imageUrl || DEFAULT_NOTICE_IMAGE} alt={`${notice.title} 대표 이미지`} />
        </figure>

        <section className="blog-body">
          {notice.content.split('\n').map((paragraph, index) => (
            <p key={`${notice.id}-${index}`}>
              {paragraph}
            </p>
          ))}
        </section>

        {relatedNotices.length > 0 && (
          <aside className="related-section">
            <div className="related-heading">
              <span>More Notice</span>
              <h2>다른 공지 보기</h2>
            </div>
            <div className="related-grid">
              {relatedNotices.map((item) => (
                <Link key={item.id} href={`/notice/${item.id}`} className="related-card">
                  <img src={item.imageUrl || DEFAULT_NOTICE_IMAGE} alt={`${item.title} 썸네일`} />
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>

      <style jsx>{`
        .notice-detail-page {
          min-height: 100vh;
          background: #ffffff;
          color: #161616;
        }

        .notice-detail-hero {
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

        .detail-action-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .detail-meta-row span {
          color: #ff5a2a;
        }

        .notice-detail-hero h1 {
          max-width: 980px;
          color: #ffffff;
          font-family: var(--font-family-condensed);
          font-size: clamp(28px, 4.5vw, 56px);
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.01em;
          word-break: keep-all;
        }

        .notice-detail-hero p {
          max-width: 720px;
          color: #d7d7d7;
          font-size: 18px;
          line-height: 1.7;
        }

        .detail-author {
          color: #8d8d8d;
          font-size: 14px;
          font-weight: 900;
        }

        .notice-detail-main {
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
          .related-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .notice-detail-hero {
            margin-top: 92px;
          }

          .detail-hero-inner {
            min-height: 360px;
            padding-bottom: 40px;
          }

          .detail-meta-row {
            flex-direction: column;
          }

          .notice-detail-hero p,
          .blog-body p {
            font-size: 16px;
          }
        }
      `}</style>
    </article>
  );
}
