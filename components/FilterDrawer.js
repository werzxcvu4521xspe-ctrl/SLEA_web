'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const REGIONS = ['조치원읍', '나성동', '아름동', '도담동', '보람동', '고운동', '어진동', '한솔동', '면지역'];
const YEARS = [
  { id: 'under_1', label: '1년 이하' },
  { id: '2_3', label: '2~3년 차' },
  { id: '4_5', label: '4~5년 차' },
  { id: 'over_5', label: '5년 이상' }
];
const FEATURES = [
  { id: 'rental', label: '공간 대관 가능' },
  { id: 'class', label: '클래스/체험 운영' },
  { id: 'parking', label: '주차 가능' }
];

export default function FilterDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filters
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Sync state with URL params on mount or param changes
  useEffect(() => {
    setSelectedRegions(searchParams.get('regions')?.split(',') || []);
    setSelectedYears(searchParams.get('years')?.split(',') || []);
    setSelectedFeatures(searchParams.get('features')?.split(',') || []);
  }, [searchParams]);

  // Handle updates
  const handleToggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleToggleYear = (yearId) => {
    setSelectedYears((prev) =>
      prev.includes(yearId) ? prev.filter((y) => y !== yearId) : [...prev, yearId]
    );
  };

  const handleToggleFeature = (featId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featId) ? prev.filter((f) => f !== featId) : [...prev, featId]
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedRegions.length > 0) {
      params.set('regions', selectedRegions.join(','));
    } else {
      params.delete('regions');
    }

    if (selectedYears.length > 0) {
      params.set('years', selectedYears.join(','));
    } else {
      params.delete('years');
    }

    if (selectedFeatures.length > 0) {
      params.set('features', selectedFeatures.join(','));
    } else {
      params.delete('features');
    }

    params.delete('page'); // Reset pagination
    router.push(`/archive?${params.toString()}`);
    onClose();
  };

  const handleReset = () => {
    setSelectedRegions([]);
    setSelectedYears([]);
    setSelectedFeatures([]);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('regions');
    params.delete('years');
    params.delete('features');
    params.delete('page');
    
    router.push(`/archive?${params.toString()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="filter-drawer-overlay" onClick={onClose}>
      <div className="filter-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <h3>상세 필터</h3>
          <div className="header-actions">
            <button type="button" className="reset-btn" onClick={handleReset}>
              초기화
            </button>
            <button type="button" className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Filters */}
        <div className="drawer-body">
          {/* Region */}
          <div className="filter-group">
            <h4 className="group-title">세종시 지역 구분</h4>
            <div className="grid-tags">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  className={`tag-btn ${selectedRegions.includes(region) ? 'selected' : ''}`}
                  onClick={() => handleToggleRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Startup Age */}
          <div className="filter-group">
            <h4 className="group-title">창업 연차</h4>
            <div className="grid-list">
              {YEARS.map((year) => (
                <label key={year.id} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={selectedYears.includes(year.id)}
                    onChange={() => handleToggleYear(year.id)}
                  />
                  <span className="checkbox-label">{year.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="filter-group">
            <h4 className="group-title">공간 지원 & 특성</h4>
            <div className="grid-list">
              {FEATURES.map((feat) => (
                <label key={feat.id} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feat.id)}
                    onChange={() => handleToggleFeature(feat.id)}
                  />
                  <span className="checkbox-label">{feat.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="drawer-footer">
          <button type="button" className="apply-btn" onClick={handleApply}>
            필터 적용하기
          </button>
        </div>
      </div>

      <style jsx>{`
        .filter-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1050;
          display: flex;
        }

        .filter-drawer-content {
          width: 100%;
          max-width: 380px;
          height: 100%;
          background: var(--color-white);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-medium);
          animation: slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .drawer-header {
          padding: 24px 20px;
          border-bottom: 1px solid var(--color-gray-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drawer-header h3 {
          font-size: 18px;
          font-weight: 800;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .reset-btn {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-gray-dark);
          text-decoration: underline;
        }

        .close-btn {
          font-size: 20px;
          color: var(--color-charcoal-deep);
        }

        .drawer-body {
          flex-grow: 1;
          overflow-y: auto;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .group-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-charcoal-deep);
        }

        .grid-tags {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .tag-btn {
          font-size: 12px;
          font-weight: 600;
          background-color: var(--color-sand-light);
          color: var(--color-gray-dark);
          padding: 10px 4px;
          border-radius: var(--border-radius-sm);
          text-align: center;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .tag-btn.selected {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
          border-color: var(--color-emerald-deep);
          font-weight: 700;
        }

        .grid-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .checkbox-row input {
          width: 16px;
          height: 16px;
          accent-color: var(--color-emerald-deep);
        }

        .checkbox-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .drawer-footer {
          padding: 20px;
          border-top: 1px solid var(--color-gray-light);
        }

        .apply-btn {
          width: 100%;
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          font-size: 15px;
          font-weight: 700;
          padding: 16px;
          border-radius: var(--border-radius-md);
          text-align: center;
        }

        .apply-btn:hover {
          background-color: var(--color-emerald-medium);
        }
      `}</style>
    </div>
  );
}
