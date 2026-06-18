'use client';

import { useState } from 'react';
import Link from 'next/link';

const CABINET_DATA = {
  title: '세종의 뿌리 조치원, 청년 크리에이터로 다시 숨 쉬다',
  subtitle: '오래된 역사와 청년들의 감각이 결합된 조치원 브랜드 아카이빙 시리즈',
  items: [
    {
      id: 'brewery',
      fileNo: 'file no.1',
      title: '백 년 양조장의 짜릿한 맥주 부활기 (조치원 브루어리)',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
      link: '/archive'
    },
    {
      id: 'dancha',
      fileNo: 'file no.2',
      title: '1930년대 고택에서 즐기는 로컬 티 세레머니 (한옥 카페 단차)',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
      link: '/archive'
    },
    {
      id: 'peach',
      fileNo: 'file no.3',
      title: '조치원 복숭아로 구운 달콤한 디저트 플레이트 (디저트 도원)',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      link: '/archive'
    }
  ]
};

export default function CabinetSection() {
  const [hoveredItem, setHoveredItem] = useState(CABINET_DATA.items[0]);

  return (
    <section className="cabinet-section-container">
      <div className="container">
        <h2 className="section-category-title en-title animate-fade-in">Project Cabinet</h2>
        <p className="section-subtitle">{CABINET_DATA.subtitle}</p>
        
        <div className="cabinet-grid">
          {/* Left: Text and Interactive List */}
          <div className="cabinet-left">
            <h3 className="cabinet-main-title">{CABINET_DATA.title}</h3>
            
            <div className="series-list">
              {CABINET_DATA.items.map((item) => (
                <Link 
                  key={item.id}
                  href={item.link}
                  className={`series-item-row ${hoveredItem.id === item.id ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredItem(item)}
                >
                  <div className="series-text-block">
                    <span className="file-no en-title">{item.fileNo}</span>
                    <h4 className="series-item-title">{item.title}</h4>
                  </div>
                  <span className="arrow-icon">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Dynamic Image */}
          <div className="cabinet-right">
            <div className="image-frame glass-panel">
              <img 
                src={hoveredItem.image} 
                alt={hoveredItem.title} 
                className="dynamic-image"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cabinet-section-container {
          padding: 100px 0;
          background-color: var(--color-sand-light);
          border-bottom: 1px solid var(--color-gray-light);
        }

        .section-category-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-emerald-light);
          letter-spacing: 2px;
          margin-bottom: 10px;
        }

        .section-subtitle {
          font-size: 15px;
          color: var(--color-gray-dark);
          margin-bottom: 50px;
        }

        .cabinet-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 50px;
        }

        @media (min-width: 1024px) {
          .cabinet-grid {
            grid-template-columns: 1.2fr 0.8fr;
            align-items: center;
          }
        }

        .cabinet-left {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .cabinet-main-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--color-charcoal-deep);
          line-height: 1.4;
        }

        @media (min-width: 768px) {
          .cabinet-main-title {
            font-size: 36px;
          }
        }

        .series-list {
          display: flex;
          flex-direction: column;
        }

        .series-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1px solid var(--color-gray-light);
          transition: all 0.3s ease;
        }

        .series-item-row.active {
          border-bottom: 1px solid var(--color-emerald-deep);
        }

        .series-text-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-right: 20px;
        }

        .file-no {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-emerald-light);
          letter-spacing: 1.5px;
        }

        .series-item-row.active .file-no {
          color: var(--color-orange-accent);
        }

        .series-item-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--color-gray-dark);
          line-height: 1.5;
          transition: color 0.2s ease;
        }

        .series-item-row.active .series-item-title {
          color: var(--color-charcoal-deep);
        }

        .arrow-icon {
          font-size: 20px;
          color: var(--color-gray-medium);
          transition: transform 0.3s ease, color 0.2s ease;
        }

        .series-item-row.active .arrow-icon {
          transform: translateX(5px);
          color: var(--color-emerald-deep);
        }

        .cabinet-right {
          display: flex;
          justify-content: center;
        }

        .image-frame {
          position: relative;
          width: 100%;
          max-width: 440px;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          padding: 8px;
          border-radius: var(--border-radius-lg);
          transition: transform 0.3s ease;
        }

        .image-frame:hover {
          transform: translateY(-5px);
        }

        .dynamic-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: calc(var(--border-radius-lg) - 4px);
          transition: transform 0.5s ease;
        }
      `}</style>
    </section>
  );
}
