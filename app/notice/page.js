'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  DEFAULT_NOTICE_IMAGE,
  DEFAULT_NOTICES,
  NOTICE_CATEGORIES,
  NOTICE_STORAGE_KEY,
  normalizeNotice,
  normalizeNoticeCategory
} from '@/lib/notices';

export default function NoticePage() {
  const [notices, setNotices] = useState(DEFAULT_NOTICES);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [form, setForm] = useState({
    category: '협회 공지사항',
    title: '',
    author: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    pinned: false
  });
  const [uploadName, setUploadName] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subbed, setSubbed] = useState(false);

  const persistNotices = useCallback((nextNotices) => {
    setNotices(nextNotices);
    localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(nextNotices));
  }, []);

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

  const categories = NOTICE_CATEGORIES;

  const filteredNotices = useMemo(() => {
    const scopedNotices = selectedCategory === '전체'
      ? notices
      : notices.filter(notice => normalizeNoticeCategory(notice.category) === selectedCategory);

    return [...scopedNotices].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [notices, selectedCategory]);

  const featuredNotice = filteredNotices[0] || notices[0];
  const gridNotices = filteredNotices.filter(notice => notice.id !== featuredNotice?.id);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateForm('imageUrl', reader.result);
      setUploadName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateNotice = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.content.trim()) return;

    const nextNotice = {
      id: Date.now(),
      title: form.title.trim(),
      date: new Date().toISOString().slice(0, 10),
      category: normalizeNoticeCategory(form.category),
      author: form.author.trim(),
      excerpt: form.excerpt.trim() || form.content.trim().slice(0, 72),
      content: form.content.trim(),
      imageUrl: form.imageUrl || DEFAULT_NOTICE_IMAGE,
      pinned: form.pinned
    };

    persistNotices([nextNotice, ...notices]);
    setSelectedCategory('전체');
    setIsWriteOpen(false);
    setUploadName('');
    setForm({
      category: '협회 공지사항',
      title: '',
      author: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      pinned: false
    });
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email || !name) return;
    setSubbed(true);
  };

  return (
    <div className="notice-pop-page">
      <section className="notice-pop-hero">
        <div className="container notice-hero-inner">
          <div className="notice-kicker-row">
            <span className="notice-kicker">Sejong Local Notice</span>
            <span className="notice-count">{notices.length} posts</span>
          </div>
          <h1>협회 공지 채널</h1>
          <p>
            행사, 교육, 지원사업, 공모전 소식을 이미지와 함께 빠르게 올리고,
            카드형 피드로 한눈에 확인합니다.
          </p>
          <div className="notice-hero-actions">
            <button type="button" className="pop-primary-btn" onClick={() => setIsWriteOpen(true)}>
              공지 올리기
            </button>
            <button type="button" className="pop-line-btn" onClick={() => setSelectedCategory('전체')}>
              전체 보기
            </button>
          </div>
        </div>
      </section>

      <main className="container notice-pop-main">
        <div className="notice-category-strip" aria-label="공지 카테고리">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              className={`notice-chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {featuredNotice && (
          <section className="notice-featured">
            <Link href={`/notice/${featuredNotice.id}`} className="featured-image" aria-label={`${featuredNotice.title} 상세 보기`}>
              <img src={featuredNotice.imageUrl || DEFAULT_NOTICE_IMAGE} alt={`${featuredNotice.title} 대표 이미지`} />
              {featuredNotice.pinned && <span className="pin-label">Pinned</span>}
            </Link>
            <div className="featured-copy">
              <div className="notice-meta">
                <span>{featuredNotice.category}</span>
                <span>{featuredNotice.date}</span>
              </div>
              <Link href={`/notice/${featuredNotice.id}`} className="notice-title-link">
                <h2>{featuredNotice.title}</h2>
              </Link>
              <p>{featuredNotice.excerpt}</p>
              <div className="notice-author-row">
                <span>by {featuredNotice.author}</span>
                <Link href={`/notice/${featuredNotice.id}`} className="text-arrow-btn">
                  자세히 보기
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="notice-content-grid">
          <div className="notice-card-grid">
            {gridNotices.map(notice => (
              <article key={notice.id} className="notice-card">
                <Link href={`/notice/${notice.id}`} className="notice-card-image" aria-label={`${notice.title} 상세 보기`}>
                  <img src={notice.imageUrl || DEFAULT_NOTICE_IMAGE} alt={`${notice.title} 썸네일`} />
                </Link>
                <div className="notice-card-copy">
                  <div className="notice-meta">
                    <span>{notice.category}</span>
                    <span>{notice.date}</span>
                  </div>
                  <Link href={`/notice/${notice.id}`} className="notice-title-link">
                    <h3>{notice.title}</h3>
                  </Link>
                  <p>{notice.excerpt}</p>
                </div>
              </article>
            ))}

            {gridNotices.length === 0 && (
              <div className="notice-empty">
                선택한 카테고리에 표시할 추가 공지가 없습니다.
              </div>
            )}
          </div>

          <aside className="notice-side-panel">
            <div className="newsletter-box">
              <span className="side-eyebrow">Weekly Letter</span>
              <h3>세종 로컬 소식을 메일로 받기</h3>
              {subbed ? (
                <p className="subscribe-success">{name}님, 구독 신청이 완료되었습니다.</p>
              ) : (
                <form className="notice-subscribe-form" onSubmit={handleSubscribe}>
                  <label htmlFor="news-name">이름</label>
                  <input
                    id="news-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="이름"
                  />
                  <label htmlFor="news-email">이메일</label>
                  <input
                    id="news-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="example@sejonglocal.kr"
                  />
                  <button type="submit" className="pop-primary-btn stretch">구독하기</button>
                </form>
              )}
            </div>

            <div className="notice-upload-note">
              <span className="side-eyebrow">Upload Ready</span>
              <strong>이미지 공지 등록 가능</strong>
              <p>운영자는 공지 작성 시 대표 이미지를 선택해 카드 피드와 상세 보기 모두에 함께 노출할 수 있습니다.</p>
            </div>
          </aside>
        </section>
      </main>

      {isWriteOpen && (
        <div className="notice-modal-backdrop" onClick={() => setIsWriteOpen(false)}>
          <div className="notice-write-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="side-eyebrow">New Notice</span>
                <h2>공지 올리기</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsWriteOpen(false)} aria-label="공지 작성 닫기">
                Close
              </button>
            </div>

            <form className="notice-write-form" onSubmit={handleCreateNotice}>
              <div className="form-two-col">
                <div className="notice-field">
                  <label htmlFor="notice-category">카테고리</label>
                  <select
                    id="notice-category"
                    value={form.category}
                    onChange={(event) => updateForm('category', event.target.value)}
                  >
                    <option value="협회 공지사항">협회 공지사항</option>
                    <option value="협회 활동">협회 활동</option>
                  </select>
                </div>
                <div className="notice-field">
                  <label htmlFor="notice-author">작성자</label>
                  <input
                    id="notice-author"
                    type="text"
                    required
                    value={form.author}
                    onChange={(event) => updateForm('author', event.target.value)}
                    placeholder="협회 사무국"
                  />
                </div>
              </div>

              <div className="notice-field">
                <label htmlFor="notice-title">제목</label>
                <input
                  id="notice-title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  placeholder="공지 제목을 입력하세요"
                />
              </div>

              <div className="notice-field">
                <label htmlFor="notice-excerpt">요약</label>
                <input
                  id="notice-excerpt"
                  type="text"
                  value={form.excerpt}
                  onChange={(event) => updateForm('excerpt', event.target.value)}
                  placeholder="카드에 노출될 한 줄 요약"
                />
              </div>

              <div className="notice-field">
                <label htmlFor="notice-content">본문</label>
                <textarea
                  id="notice-content"
                  required
                  rows="6"
                  value={form.content}
                  onChange={(event) => updateForm('content', event.target.value)}
                  placeholder="공지 내용을 입력하세요"
                />
              </div>

              <div className="notice-image-uploader">
                <div className="upload-preview">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="업로드 이미지 미리보기" />
                  ) : (
                    <span>Image Preview</span>
                  )}
                </div>
                <div className="upload-controls">
                  <label htmlFor="notice-image">대표 이미지 업로드</label>
                  <input id="notice-image" type="file" accept="image/*" onChange={handleImageUpload} />
                  <p>{uploadName || '이미지를 선택하지 않으면 기본 이미지가 표시됩니다.'}</p>
                  <label className="pin-toggle">
                    <input
                      type="checkbox"
                      checked={form.pinned}
                      onChange={(event) => updateForm('pinned', event.target.checked)}
                    />
                    상단 고정
                  </label>
                </div>
              </div>

              <button type="submit" className="pop-primary-btn stretch">공지 게시하기</button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .notice-pop-page {
          min-height: 100vh;
          background: #ffffff;
          color: #161616;
          padding-bottom: 96px;
        }

        .notice-pop-hero {
          margin-top: 120px;
          background: #161616;
          color: #ffffff;
          border-bottom: 1px solid #2c2c2c;
        }

        .notice-hero-inner {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 18px;
          padding-top: 72px;
          padding-bottom: 56px;
        }

        .notice-kicker-row,
        .notice-hero-actions,
        .notice-meta,
        .notice-author-row,
        .modal-header,
        .upload-controls,
        .pin-toggle {
          display: flex;
          align-items: center;
        }

        .notice-kicker-row {
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.22);
          padding-bottom: 14px;
        }

        .notice-kicker,
        .side-eyebrow {
          font-family: var(--font-family-condensed);
          text-transform: uppercase;
          letter-spacing: 0;
          font-weight: 900;
        }

        .notice-kicker {
          color: #ff5a2a;
          font-size: 16px;
        }

        .notice-count {
          color: #b7b7b7;
          font-size: 13px;
          font-weight: 800;
        }

        .notice-pop-hero h1 {
          max-width: 880px;
          font-family: var(--font-family-condensed);
          font-size: clamp(56px, 9vw, 118px);
          font-weight: 900;
          line-height: 0.95;
          color: #ffffff;
        }

        .notice-pop-hero p {
          max-width: 680px;
          color: #d7d7d7;
          font-size: 17px;
          line-height: 1.7;
        }

        .notice-hero-actions {
          gap: 10px;
          flex-wrap: wrap;
        }

        .pop-primary-btn,
        .pop-line-btn,
        .text-arrow-btn,
        .modal-close-btn {
          min-height: 46px;
          padding: 0 18px;
          font-size: 14px;
          font-weight: 900;
          transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .pop-primary-btn {
          background: #ff5a2a;
          color: #ffffff;
          border: 1px solid #ff5a2a;
        }

        .pop-line-btn,
        .modal-close-btn {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.42);
        }

        .pop-primary-btn:hover,
        .pop-line-btn:hover,
        .text-arrow-btn:hover,
        .modal-close-btn:hover {
          transform: translateY(-2px);
        }

        .pop-primary-btn:hover {
          background: #161616;
          border-color: #161616;
        }

        .notice-pop-hero .pop-primary-btn:hover {
          background: #ffffff;
          color: #161616;
          border-color: #ffffff;
        }

        .pop-line-btn:hover,
        .modal-close-btn:hover {
          background: #ffffff;
          color: #161616;
          border-color: #ffffff;
        }

        .stretch {
          width: 100%;
          justify-content: center;
        }

        .notice-pop-main {
          padding-top: 34px;
        }

        .notice-category-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 34px;
        }

        .notice-chip {
          position: relative;
          flex: 0 0 auto;
          padding: 15px 4px 14px;
          margin-right: 28px;
          color: #6f6f6f;
          font-size: 16px;
          font-weight: 800;
          white-space: nowrap;
        }

        .notice-chip::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: #161616;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .notice-chip.active,
        .notice-chip:hover {
          color: #161616;
        }

        .notice-chip.active::after,
        .notice-chip:hover::after {
          opacity: 1;
        }

        .notice-featured {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
          padding-bottom: 42px;
          border-bottom: 8px solid #f6f6f6;
          margin-bottom: 40px;
        }

        .featured-image,
        .notice-card-image {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #f6f6f6;
        }

        .featured-image {
          aspect-ratio: 16 / 9;
        }

        .notice-card-image {
          aspect-ratio: 1 / 1;
        }

        .featured-image img,
        .notice-card-image img,
        .upload-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .featured-image:hover img,
        .notice-card:hover .notice-card-image img {
          transform: scale(1.035);
        }

        .pin-label {
          position: absolute;
          left: 14px;
          top: 14px;
          background: #ff5a2a;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          padding: 5px 9px;
        }

        .featured-copy,
        .notice-card-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .featured-copy {
          justify-content: center;
          gap: 16px;
        }

        .notice-meta {
          width: 100%;
          justify-content: space-between;
          gap: 12px;
          color: #6f6f6f;
          font-size: 13px;
          font-weight: 800;
        }

        .notice-meta span:first-child {
          color: #ff5a2a;
        }

        .featured-copy h2 {
          font-size: clamp(30px, 4vw, 54px);
          font-weight: 900;
          line-height: 1.18;
          color: #161616;
          text-align: left;
        }

        .featured-copy p {
          color: #525252;
          font-size: 16px;
          line-height: 1.75;
        }

        .notice-author-row {
          width: 100%;
          justify-content: space-between;
          gap: 16px;
          color: #8d8d8d;
          font-size: 13px;
          font-weight: 800;
        }

        .text-arrow-btn {
          display: inline-flex;
          align-items: center;
          min-height: auto;
          padding: 0 0 3px;
          color: #161616;
          border-bottom: 1px solid #161616;
        }

        .notice-title-link {
          display: block;
          width: fit-content;
        }

        .notice-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 44px;
          align-items: start;
        }

        .notice-card-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 34px 24px;
        }

        .notice-card {
          min-width: 0;
        }

        .notice-card-copy {
          gap: 8px;
          padding-top: 10px;
        }

        .notice-card h3 {
          color: #161616;
          font-size: 20px;
          font-weight: 900;
          line-height: 1.38;
          text-align: left;
        }

        .notice-card p {
          color: #525252;
          font-size: 14px;
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .notice-side-panel {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .newsletter-box,
        .notice-upload-note {
          border: 1px solid #e0e0e0;
          background: #ffffff;
          padding: 24px;
        }

        .side-eyebrow {
          display: block;
          color: #ff5a2a;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .newsletter-box h3,
        .notice-upload-note strong {
          display: block;
          color: #161616;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.35;
          margin-bottom: 16px;
        }

        .notice-upload-note p,
        .subscribe-success {
          color: #525252;
          font-size: 14px;
          line-height: 1.7;
        }

        .notice-subscribe-form,
        .notice-write-form,
        .notice-field {
          display: flex;
          flex-direction: column;
        }

        .notice-subscribe-form {
          gap: 10px;
        }

        .notice-subscribe-form label,
        .notice-field label,
        .upload-controls label {
          color: #161616;
          font-size: 13px;
          font-weight: 900;
        }

        .notice-subscribe-form input,
        .notice-field input,
        .notice-field select,
        .notice-field textarea {
          width: 100%;
          border: 1px solid #e0e0e0;
          background: #f6f6f6;
          color: #161616;
          min-height: 46px;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
        }

        .notice-field textarea {
          resize: vertical;
          line-height: 1.7;
        }

        .notice-subscribe-form input:focus,
        .notice-field input:focus,
        .notice-field select:focus,
        .notice-field textarea:focus {
          border-color: #161616;
          background: #ffffff;
        }

        .notice-empty {
          border: 1px solid #e0e0e0;
          background: #f6f6f6;
          color: #525252;
          padding: 44px 20px;
          text-align: center;
          font-weight: 900;
        }

        .notice-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1200;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .notice-write-modal {
          width: min(940px, 100%);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          background: #ffffff;
          color: #161616;
        }

        .notice-write-modal {
          padding: 28px;
        }

        .modal-header {
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 20px;
          margin-bottom: 22px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h2 {
          color: #161616;
          font-size: 32px;
          font-weight: 900;
        }

        .modal-close-btn {
          color: #161616;
          border-color: #d7d7d7;
        }

        .modal-close-btn:hover {
          background: #161616;
          color: #ffffff;
          border-color: #161616;
        }

        .notice-write-form {
          gap: 16px;
        }

        .form-two-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .notice-field {
          gap: 8px;
        }

        .notice-image-uploader {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          border: 1px solid #e0e0e0;
          background: #f6f6f6;
          padding: 14px;
        }

        .upload-preview {
          aspect-ratio: 16 / 9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #161616;
          color: #ffffff;
          font-family: var(--font-family-condensed);
          font-size: 22px;
          font-weight: 900;
        }

        .upload-controls {
          align-items: flex-start;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
        }

        .upload-controls input {
          width: 100%;
          border: 1px dashed #bdbdbd;
          background: #ffffff;
          padding: 12px;
        }

        .upload-controls p {
          color: #6f6f6f;
          font-size: 13px;
          line-height: 1.5;
        }

        .pin-toggle {
          gap: 8px;
          cursor: pointer;
        }

        .pin-toggle input {
          width: 16px;
          height: 16px;
          accent-color: #ff5a2a;
        }

        @media (min-width: 768px) {
          .notice-featured {
            grid-template-columns: minmax(0, 1.25fr) minmax(340px, 0.75fr);
          }

          .notice-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .form-two-col,
          .notice-image-uploader {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1100px) {
          .notice-content-grid {
            grid-template-columns: minmax(0, 1fr) 320px;
          }

          .notice-side-panel {
            position: sticky;
            top: 122px;
          }
        }

        @media (max-width: 640px) {
          .notice-pop-hero {
            margin-top: 92px;
          }

          .notice-hero-inner {
            min-height: 320px;
            padding-bottom: 36px;
          }

          .notice-pop-hero p {
            font-size: 15px;
          }

          .notice-chip {
            margin-right: 18px;
            font-size: 14px;
          }

          .notice-write-modal {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
