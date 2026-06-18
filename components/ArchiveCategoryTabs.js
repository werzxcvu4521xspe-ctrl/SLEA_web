'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'F&B', label: 'F&B (식음료)' },
  { id: 'Craft', label: '로컬제조 (공예/디자인)' },
  { id: 'Culture', label: '문화/예술/체험' },
  { id: 'Space', label: '공유공간/대관' },
  { id: 'Tech', label: 'IT / 스마트 테크' }
];

export default function ArchiveCategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const handleCategoryClick = (id) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') {
      params.delete('category');
    } else {
      params.set('category', id);
    }
    // Keep search query if present, reset page
    params.delete('page');
    router.push(`/archive?${params.toString()}`);
  };

  return (
    <div className="category-tabs-container">
      <div className="tabs-scroll-wrapper">
        <div className="tabs-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`tab-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-tabs-container {
          width: 100%;
          border-bottom: 1px solid var(--color-gray-light);
          background-color: var(--color-white);
          position: sticky;
          top: var(--header-height);
          z-index: 10;
        }

        .tabs-scroll-wrapper {
          max-width: var(--max-width-content);
          margin: 0 auto;
          padding: 0 20px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .tabs-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }

        .tabs-list {
          display: flex;
          gap: 24px;
          height: 60px;
          align-items: center;
          white-space: nowrap;
        }

        .tab-item {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-gray-dark);
          padding: 18px 0;
          position: relative;
          transition: color 0.2s ease;
        }

        .tab-item:hover,
        .tab-item.active {
          color: var(--color-emerald-deep);
        }

        .tab-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          background-color: var(--color-emerald-deep);
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tab-item.active::after {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
