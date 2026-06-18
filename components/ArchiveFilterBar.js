'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterDrawer from './FilterDrawer';

export default function ArchiveFilterBar({ totalCount }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Sync search input with URL search param
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/archive?${params.toString()}`);
  };

  const handleSortChange = (sortType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortType);
    router.push(`/archive?${params.toString()}`);
  };

  const handleViewChange = (viewType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', viewType);
    router.push(`/archive?${params.toString()}`);
  };

  const currentSort = searchParams.get('sort') || 'latest';
  const currentView = searchParams.get('view') || 'grid';

  return (
    <div className="filter-bar-container">
      {/* Search and Advanced Filter Trigger */}
      <div className="search-filter-row">
        <form className="inline-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="공간명 또는 키워드를 검색하세요."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="inline-search-input"
          />
          <button type="submit" className="search-submit">🔍</button>
        </form>
        <button 
          type="button" 
          className="advanced-filter-btn glass-panel"
          onClick={() => setIsDrawerOpen(true)}
        >
          ⚙️ 상세 필터
        </button>
      </div>

      {/* Stats and Layout options */}
      <div className="stats-layout-row">
        <div className="total-count-label">
          총 <span className="bold-count">{totalCount}</span>개의 공간
        </div>
        
        <div className="display-options">
          {/* Sorting */}
          <div className="sort-options">
            <button
              type="button"
              className={`sort-btn ${currentSort === 'latest' ? 'active' : ''}`}
              onClick={() => handleSortChange('latest')}
            >
              최신순
            </button>
            <span className="divider">|</span>
            <button
              type="button"
              className={`sort-btn ${currentSort === 'recommend' ? 'active' : ''}`}
              onClick={() => handleSortChange('recommend')}
            >
              추천순
            </button>
          </div>

          {/* Grid/List switch */}
          <div className="view-switch-box">
            <button
              type="button"
              className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewChange('grid')}
              aria-label="그리드 뷰"
            >
              田
            </button>
            <button
              type="button"
              className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
              onClick={() => handleViewChange('list')}
              aria-label="리스트 뷰"
            >
              目
            </button>
          </div>
        </div>
      </div>

      {/* Left drawer menu */}
      <FilterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <style jsx>{`
        .filter-bar-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .search-filter-row {
          display: flex;
          gap: 12px;
          flex-direction: column;
        }

        @media (min-width: 600px) {
          .search-filter-row {
            flex-direction: row;
          }
        }

        .inline-search-form {
          display: flex;
          flex-grow: 1;
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          padding: 0 12px;
          align-items: center;
        }

        .inline-search-input {
          flex-grow: 1;
          border: none;
          height: 48px;
          outline: none;
          font-size: 14px;
          font-weight: 600;
        }

        .search-submit {
          font-size: 16px;
        }

        .advanced-filter-btn {
          border-radius: var(--border-radius-md);
          background-color: var(--color-white);
          color: var(--color-charcoal-deep);
          font-size: 14px;
          font-weight: 700;
          height: 50px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .stats-layout-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-gray-light);
        }

        .total-count-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .bold-count {
          color: var(--color-emerald-deep);
          font-weight: 800;
        }

        .display-options {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .sort-options {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .sort-btn {
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .sort-btn.active {
          color: var(--color-emerald-deep);
          font-weight: 800;
        }

        .divider {
          color: var(--color-gray-light);
        }

        .view-switch-box {
          display: flex;
          gap: 4px;
          border: 1px solid var(--color-gray-light);
          padding: 2px;
          border-radius: var(--border-radius-sm);
          background-color: var(--color-sand-light);
        }

        .view-btn {
          font-size: 15px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius-sm);
          color: var(--color-gray-dark);
          font-weight: bold;
        }

        .view-btn.active {
          background-color: var(--color-white);
          color: var(--color-emerald-deep);
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
