'use client';

import { useEffect, useState } from 'react';

export const BOOKMARK_STORAGE_KEY = 'selo_saved_bookmarks';

function readBookmarks() {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKMARK_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(BOOKMARK_STORAGE_KEY);
    return [];
  }
}

export default function BookmarkButton({ item }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readBookmarks().some((bookmark) => bookmark.id === item.id));
  }, [item.id]);

  const toggleBookmark = () => {
    const bookmarks = readBookmarks();
    const exists = bookmarks.some((bookmark) => bookmark.id === item.id);
    const nextBookmarks = exists
      ? bookmarks.filter((bookmark) => bookmark.id !== item.id)
      : [{ ...item, savedAt: new Date().toISOString() }, ...bookmarks];

    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(nextBookmarks));
    setSaved(!exists);
    window.dispatchEvent(new Event('selo_bookmark_update'));
  };

  return (
    <button type="button" className={`bookmark-button ${saved ? 'saved' : ''}`} onClick={toggleBookmark}>
      {saved ? '저장됨' : '북마크'}
      <style jsx>{`
        .bookmark-button {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border: 1px solid rgba(255, 255, 255, 0.34);
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        .bookmark-button:hover,
        .bookmark-button.saved {
          border-color: #ff5a2a;
          background: #ff5a2a;
          color: #ffffff;
        }
      `}</style>
    </button>
  );
}
