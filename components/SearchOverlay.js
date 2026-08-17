'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchOverlay({ isOpen, onClose }) {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus input on mount
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setKeyword('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/sero-members?search=${encodeURIComponent(keyword.trim())}`);
    handleClose();
  };

  const handleTagClick = (tag) => {
    router.push(`/sero-members?category=${encodeURIComponent(tag)}`);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-inner container animate-fade-in">
        {/* Header with Search Form */}
        <div className="search-header-row">
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              placeholder="회원사, 브랜드, 콘텐츠 키워드를 검색해 보세요."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
            {keyword && (
              <button type="button" className="clear-btn" onClick={() => setKeyword('')}>
                ✕
              </button>
            )}
            <button type="submit" className="submit-btn">
              🔍
            </button>
          </form>
          <button type="button" className="close-btn" onClick={handleClose} aria-label="검색 닫기">
            ✕
          </button>
        </div>

        {/* Recommended Keywords */}
        <div className="recommend-keywords-section">
          <p className="section-title">추천 검색어</p>
          <div className="tag-cloud">
            {['회원사', '인터뷰', 'SNS 콘텐츠', '브랜드 스토리', 'F&B', '공예', '교육', '스타트업'].map((tag) => (
              <button 
                key={tag} 
                type="button" 
                className="keyword-tag" 
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: var(--glass-blur);
          z-index: 1100;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
        }

        .search-inner {
          max-width: 720px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 0 20px;
        }

        .search-header-row {
          display: flex;
          align-items: center;
          gap: 20px;
          width: 100%;
        }

        .search-form {
          display: flex;
          align-items: center;
          flex-grow: 1;
          border-bottom: 2px solid var(--color-emerald-deep);
          padding-bottom: 8px;
          position: relative;
        }

        .search-input {
          flex-grow: 1;
          border: none;
          background: transparent;
          font-size: 22px;
          font-weight: 700;
          color: var(--color-charcoal-deep);
          outline: none;
          padding-right: 60px;
        }

        .search-input::placeholder {
          color: var(--color-gray-medium);
          font-weight: 500;
        }

        .clear-btn {
          position: absolute;
          right: 40px;
          font-size: 16px;
          color: var(--color-gray-dark);
          padding: 4px;
        }

        .submit-btn {
          font-size: 20px;
          padding: 4px;
        }

        .close-btn {
          font-size: 28px;
          font-weight: 300;
          color: var(--color-charcoal-deep);
          padding: 8px;
        }

        .recommend-keywords-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-gray-dark);
          letter-spacing: 0.5px;
        }

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .keyword-tag {
          font-size: 14px;
          font-weight: 600;
          background-color: var(--color-sand-medium);
          color: var(--color-emerald-deep);
          padding: 8px 16px;
          border-radius: var(--border-radius-full);
          transition: all 0.2s ease;
        }

        .keyword-tag:hover {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
