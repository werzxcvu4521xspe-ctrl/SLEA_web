'use client';

import { useState } from 'react';
import Link from 'next/link';

const defaultReviews = [
  {
    id: 'review-branding',
    field: '브랜딩',
    brand: '디저트 카페 도원',
    author: '이 대표',
    title: '계절 메뉴를 브랜드 스토리로 정리할 수 있었어요.',
    body: '복숭아 시즌 메뉴를 단순 상품이 아니라 지역성과 연결된 브랜드 콘텐츠로 설명하는 방법을 배웠습니다.',
    date: '2026-08-08'
  },
  {
    id: 'review-market',
    field: '온라인 판로',
    brand: '밀마루 베이커리',
    author: '황 대표',
    title: '상품 상세페이지 구조가 훨씬 명확해졌습니다.',
    body: '쌀빵의 장점을 어떤 순서로 설명해야 구매자가 이해하는지 피드백을 받았고 바로 수정할 수 있었습니다.',
    date: '2026-08-02'
  },
  {
    id: 'review-funding',
    field: '정부지원사업',
    brand: '공방 세종',
    author: '박 대표',
    title: '지원사업 신청 전에 부족한 자료를 알게 됐어요.',
    body: '사업계획서에 필요한 매출 근거, 고객 정의, 실행 일정표를 구체적으로 점검받았습니다.',
    date: '2026-07-26'
  }
];

export default function MentoringReviewsPage() {
  const [reviews, setReviews] = useState(defaultReviews);
  const [form, setForm] = useState({
    field: '브랜딩',
    brand: '',
    author: '',
    title: '',
    body: ''
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitReview = (event) => {
    event.preventDefault();
    if (!form.brand.trim() || !form.title.trim() || !form.body.trim()) return;

    setReviews([
      {
        id: `review-${Date.now()}`,
        ...form,
        brand: form.brand.trim(),
        author: form.author.trim() || '익명 회원',
        title: form.title.trim(),
        body: form.body.trim(),
        date: new Date().toISOString().slice(0, 10)
      },
      ...reviews
    ]);
    setForm({ field: '브랜딩', brand: '', author: '', title: '', body: '' });
  };

  return (
    <main className="review-page">
      <section className="review-hero">
        <div className="container review-hero-inner">
          <Link href="/mentoring-day" className="back-link">← 멘토링 데이</Link>
          <div className="hero-kicker">
            <span className="section-label en-title">Mentoring Reviews</span>
            <strong>{reviews.length} reviews</strong>
          </div>
          <h1>멘토링 후기</h1>
          <p>회원사가 실제 상담 후 얻은 변화, 실행 과제, 다음 액션을 기록합니다.</p>
        </div>
      </section>

      <section className="container review-main">
        <div className="review-grid">
          {reviews.map((review) => (
            <article key={review.id} className="review-card">
              <div className="review-meta">
                <span>{review.field}</span>
                <time dateTime={review.date}>{review.date}</time>
              </div>
              <h2>{review.title}</h2>
              <p>{review.body}</p>
              <strong>{review.brand} · {review.author}</strong>
            </article>
          ))}
        </div>

        <form className="review-form" onSubmit={submitReview}>
          <span className="section-label en-title">Write Review</span>
          <h2>후기 작성</h2>
          <select value={form.field} onChange={(event) => updateForm('field', event.target.value)}>
            <option>브랜딩</option>
            <option>마케팅/SNS</option>
            <option>세무/회계</option>
            <option>상품 기획</option>
            <option>온라인 판로</option>
            <option>정부지원사업</option>
          </select>
          <input required value={form.brand} onChange={(event) => updateForm('brand', event.target.value)} placeholder="브랜드/기업명" />
          <input value={form.author} onChange={(event) => updateForm('author', event.target.value)} placeholder="작성자명" />
          <input required value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="후기 제목" />
          <textarea required value={form.body} onChange={(event) => updateForm('body', event.target.value)} placeholder="멘토링을 통해 얻은 변화와 실행 과제를 적어주세요." />
          <button type="submit">후기 등록</button>
        </form>
      </section>

      <style jsx>{`
        .review-page {
          min-height: 100vh;
          background: #ffffff;
          color: #161616;
        }

        .review-hero {
          margin-top: var(--header-height);
          background: #111111;
          color: #ffffff;
        }

        .review-hero-inner {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 18px;
          padding-top: 80px;
          padding-bottom: 56px;
        }

        .back-link {
          width: fit-content;
          color: #d7d7d7;
          font-size: 14px;
          font-weight: 900;
          border-bottom: 1px solid rgba(255, 255, 255, 0.42);
          padding-bottom: 4px;
        }

        .hero-kicker,
        .review-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          padding-bottom: 14px;
        }

        .hero-kicker strong {
          color: #b7b7b7;
          font-size: 13px;
          font-weight: 900;
        }

        h1 {
          max-width: 980px;
          color: #ffffff;
          font-family: var(--font-family-condensed);
          font-size: clamp(48px, 8vw, 112px);
          font-weight: 900;
          line-height: 1;
        }

        .review-hero p {
          max-width: 720px;
          color: #d7d7d7;
          font-size: 18px;
          line-height: 1.7;
        }

        .review-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 28px;
          padding-top: 48px;
          padding-bottom: 96px;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 22px;
        }

        .review-card,
        .review-form {
          border: 1px solid #e0e0e0;
          background: #ffffff;
          padding: clamp(24px, 3vw, 38px);
        }

        .review-meta {
          border-bottom-color: #e0e0e0;
          margin-bottom: 22px;
        }

        .review-meta span,
        .review-form .section-label {
          color: #ff5a2a;
          font-size: 13px;
          font-weight: 900;
        }

        .review-meta time {
          color: #777777;
          font-size: 13px;
          font-weight: 900;
        }

        .review-card h2,
        .review-form h2 {
          color: #161616;
          font-family: var(--font-family-condensed);
          font-size: clamp(28px, 3.8vw, 46px);
          font-weight: 900;
          line-height: 1.12;
        }

        .review-card p {
          margin-top: 20px;
          color: #4f4f4f;
          font-size: 16px;
          line-height: 1.8;
        }

        .review-card strong {
          display: block;
          margin-top: 24px;
          color: #161616;
          font-size: 14px;
          font-weight: 900;
        }

        .review-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .review-form input,
        .review-form select,
        .review-form textarea {
          width: 100%;
          min-height: 48px;
          padding: 12px 14px;
          border: 1px solid #d8d8d8;
          color: #161616;
          font: inherit;
          font-weight: 800;
        }

        .review-form textarea {
          min-height: 140px;
          resize: vertical;
          line-height: 1.6;
        }

        .review-form button {
          min-height: 52px;
          background: #ff5a2a;
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
        }

        @media (min-width: 980px) {
          .review-main {
            grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.55fr);
          }

          .review-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </main>
  );
}
