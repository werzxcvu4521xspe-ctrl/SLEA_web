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

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  const featuredSlides = useMemo(() => filteredNotices.slice(0, 4), [filteredNotices]);
  const gridNotices = useMemo(() => filteredNotices.slice(featuredSlides.length), [filteredNotices, featuredSlides.length]);

  // Reset slide index when category changes
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [selectedCategory]);

  // Auto slide interval
  useEffect(() => {
    if (featuredSlides.length <= 1 || isSliderPaused) return;

    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % featuredSlides.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [featuredSlides.length, isSliderPaused]);

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
      <section className="notice-pop-hero page-hero-banner">
        <div className="container notice-hero-inner">
          <div className="notice-kicker-row">
            <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>
              Sejong Local Notice
            </span>
            <span className="notice-count">{notices.length} posts</span>
          </div>
          <h1 className="page-hero-title">공지사항</h1>
          <p className="page-hero-desc">협회 공지사항과 협회 활동 소식을 이미지 콘텐츠로 빠르게 확인합니다.</p>
        </div>
      </section>

      <main className="container notice-pop-main">
        <div className="notice-toolbar">
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
          <button type="button" className="notice-upload-btn" onClick={() => setIsWriteOpen(true)}>
            공지 올리기
          </button>
        </div>

        <section className="notice-grid-container">
          {/* Desktop/Tablet View (Show slider + remaining notices in grid) */}
          <div className="notice-desktop-view">
            <div className="notice-magazine-grid">
              {featuredSlides.length > 0 && (
                <article
                  className="notice-card featured-card slider-card"
                  onMouseEnter={() => setIsSliderPaused(true)}
                  onMouseLeave={() => setIsSliderPaused(false)}
                >
                  <div className="slider-wrapper">
                    {featuredSlides.map((notice, idx) => (
                      <Link
                        key={notice.id}
                        href={`/notice/${notice.id}`}
                        className={`slide-item ${idx === activeSlideIndex ? 'active' : ''}`}
                        aria-label={`${notice.title} 상세 보기`}
                      >
                        <img src={notice.imageUrl || DEFAULT_NOTICE_IMAGE} alt={notice.title} />
                        <div className="featured-overlay">
                          <div className="featured-meta">
                            <span>{notice.category}</span>
                            <span>{notice.date}</span>
                          </div>
                          <h3>{notice.title}</h3>
                        </div>
                      </Link>
                    ))}
                    {featuredSlides.length > 1 && (
                      <div className="slider-indicator">
                        <span>{activeSlideIndex + 1}</span>
                        <span className="divider">/</span>
                        <span>{featuredSlides.length}</span>
                      </div>
                    )}
                  </div>
                </article>
              )}

              {gridNotices.map((notice) => (
                <article key={notice.id} className="notice-card standard-card">
                  <Link href={`/notice/${notice.id}`} className="notice-card-image-wrapper" aria-label={`${notice.title} 상세 보기`}>
                    <img src={notice.imageUrl || DEFAULT_NOTICE_IMAGE} alt={notice.title} />
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
            </div>
          </div>

          {/* Mobile View (No slider, all notices displayed in a 2-column grid) */}
          <div className="notice-mobile-view">
            <div className="notice-mobile-grid">
              {filteredNotices.map((notice) => (
                <article key={notice.id} className="notice-card standard-card">
                  <Link href={`/notice/${notice.id}`} className="notice-card-image-wrapper" aria-label={`${notice.title} 상세 보기`}>
                    <img src={notice.imageUrl || DEFAULT_NOTICE_IMAGE} alt={notice.title} />
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
            </div>
          </div>

          {filteredNotices.length === 0 && (
            <div className="notice-empty">
              선택한 카테고리에 표시할 공지사항이 없습니다.
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="notice-newsletter-banner">
          <div className="newsletter-banner-content">
            <span className="side-eyebrow">Weekly Letter</span>
            <h3>세종 로컬의 생생한 소식을 메일로 받아보세요</h3>
            {subbed ? (
              <p className="subscribe-success">{name}님, 구독 신청이 완료되었습니다.</p>
            ) : (
              <form className="notice-subscribe-inline-form" onSubmit={handleSubscribe}>
                <input
                  id="news-name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="이름"
                />
                <input
                  id="news-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="이메일 주소 (example@sejonglocal.kr)"
                />
                <button type="submit" className="pop-primary-btn">구독하기</button>
              </form>
            )}
          </div>
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
          margin-top: 100px;
          background: var(--brand-solid);
          color: var(--color-sand-warm);
          border-bottom: 0;
        }

        .notice-hero-inner {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .notice-kicker-row,
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          padding-bottom: 14px;
        }

        .side-eyebrow {
          font-family: var(--font-family-condensed);
          text-transform: uppercase;
          letter-spacing: 0;
          font-weight: 900;
        }

        .notice-count {
          color: #b7b7b7;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
        }

        .pop-primary-btn,
        .pop-line-btn,
        .notice-upload-btn,
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

        .notice-upload-btn {
          flex: 0 0 auto;
          background: #161616;
          color: #ffffff;
          border: 1px solid #161616;
        }

        .pop-line-btn,
        .modal-close-btn {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.42);
        }

        .pop-primary-btn:hover,
        .pop-line-btn:hover,
        .notice-upload-btn:hover,
        .text-arrow-btn:hover,
        .modal-close-btn:hover {
          transform: translateY(-2px);
        }

        .pop-primary-btn:hover {
          background: #161616;
          border-color: #161616;
        }

        .notice-upload-btn:hover {
          background: #ff5a2a;
          border-color: #ff5a2a;
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

        .notice-toolbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 34px;
        }

        .notice-category-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
        }

        .notice-chip {
          position: relative;
          flex: 0 0 auto;
          padding: 15px 0 14px;
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

        .notice-grid-container {
          width: 100%;
          margin-bottom: 56px;
        }

        .notice-desktop-view {
          display: none;
        }

        .notice-mobile-view {
          display: block;
        }

        .notice-mobile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px 16px;
        }

        @media (min-width: 640px) {
          .notice-desktop-view {
            display: block;
          }

          .notice-mobile-view {
            display: none;
          }
        }

        .notice-magazine-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 40px 24px;
        }

        /* Standard card styles */
        .notice-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100%;
        }

        .notice-card-image-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #f6f6f6;
          display: block;
        }

        .standard-card .notice-card-image-wrapper {
          aspect-ratio: 1 / 1;
        }

        .notice-card-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .notice-card:hover .notice-card-image-wrapper img {
          transform: scale(1.04);
        }

        /* Featured card styles (slider overlay) */
        .featured-card {
          grid-column: span 1;
          position: relative;
          height: 100%;
        }

        .slider-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #f6f6f6;
          aspect-ratio: 16 / 10;
        }

        .slide-item {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          transform: scale(1.02);
          z-index: 1;
          display: block;
        }

        .slide-item.active {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
          z-index: 2;
        }

        .slide-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-item:hover img {
          transform: scale(1.04);
        }

        .featured-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 55%, rgba(0, 0, 0, 0.1) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px;
          color: #ffffff;
        }

        .featured-meta {
          display: flex;
          gap: 12px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .featured-meta span:first-child {
          color: var(--color-orange-accent);
        }

        .slide-item h3 {
          font-size: clamp(20px, 2.5vw, 32px);
          font-weight: 900;
          line-height: 1.25;
          color: #ffffff;
          word-break: keep-all;
        }

        .slider-indicator {
          position: absolute;
          right: 20px;
          bottom: 20px;
          background: rgba(0, 0, 0, 0.5);
          color: #ffffff;
          padding: 6px 12px;
          font-family: var(--font-family-mono, monospace);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 10;
          border-radius: 2px;
          backdrop-filter: blur(4px);
          letter-spacing: 0.05em;
        }

        .slider-indicator .divider {
          opacity: 0.6;
          font-weight: 300;
        }

        /* Copy styles for standard card */
        .notice-card-copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
        }

        .notice-meta {
          display: flex;
          justify-content: space-between;
          color: #6f6f6f;
          font-size: 13px;
          font-weight: 800;
        }

        .notice-meta span:first-child {
          color: #ff5a2a;
        }

        .notice-card-copy h3 {
          color: #161616;
          font-size: 18px;
          font-weight: 900;
          line-height: 1.4;
          text-align: left;
          word-break: keep-all;
        }

        .notice-card-copy p {
          color: #525252;
          font-size: 14px;
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Newsletter Banner styling */
        .notice-newsletter-banner {
          background: #f6f6f6;
          border: 1px solid #e0e0e0;
          padding: 48px 30px;
          margin-bottom: 72px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          width: 100%;
        }

        .newsletter-banner-content {
          max-width: 680px;
          width: 100%;
        }

        .newsletter-banner-content h3 {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 900;
          color: #161616;
          margin-bottom: 24px;
        }

        .notice-subscribe-inline-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .notice-subscribe-inline-form input {
          border: 1px solid #e0e0e0;
          background: #ffffff;
          color: #161616;
          min-height: 48px;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 700;
        }

        .notice-subscribe-inline-form input:focus {
          border-color: #161616;
          outline: none;
        }

        .notice-subscribe-inline-form button {
          min-height: 48px;
          background: #ff5a2a;
          color: #ffffff;
          font-weight: 900;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .notice-subscribe-inline-form button:hover {
          background: #e0481d;
        }

        .side-eyebrow {
          display: block;
          color: #ff5a2a;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .subscribe-success {
          color: #525252;
          font-size: 14px;
          line-height: 1.7;
        }

        .notice-write-note {
          border: 1px solid #e0e0e0;
          background: #ffffff;
          padding: 24px;
        }

        .notice-write-form,
        .notice-field {
          display: flex;
          flex-direction: column;
        }

        .notice-field label,
        .upload-controls label {
          color: #161616;
          font-size: 13px;
          font-weight: 900;
        }

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

        @media (min-width: 640px) {
          .notice-magazine-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .featured-card {
            grid-column: span 2;
          }
        }

        @media (min-width: 768px) {
          .notice-magazine-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .featured-card {
            grid-column: span 2;
          }

          .form-two-col,
          .notice-image-uploader {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .notice-magazine-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }

          .featured-card {
            grid-column: span 3;
          }
        }

        @media (max-width: 640px) {
          .notice-pop-hero {
            margin-top: 92px;
          }

          .notice-toolbar {
            flex-direction: column;
            gap: 14px;
            padding-bottom: 18px;
          }

          .notice-upload-btn {
            width: 100%;
            justify-content: center;
          }

          .notice-category-strip {
            gap: 18px;
          }

          .notice-chip {
            font-size: 14px;
          }

          .notice-write-modal {
            padding: 20px;
          }

          .notice-card-copy h3 {
            font-size: 14px;
            line-height: 1.35;
          }

          .notice-card-copy p {
            font-size: 11px;
            line-height: 1.5;
          }

          .notice-card-copy {
            padding-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}
