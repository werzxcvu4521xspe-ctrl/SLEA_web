'use client';

import Link from 'next/link';

const MOCK_RANKINGS = [
  {
    rank: 1,
    name: '디저트 카페 도원',
    category: 'Jochiwon / F&B',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop'
  },
  {
    rank: 2,
    name: '조치원 브루어리',
    category: 'Jochiwon / Culture',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop'
  },
  {
    rank: 3,
    name: '한옥 찻집 단차',
    category: 'Geumnam / F&B',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop'
  },
  {
    rank: 4,
    name: '공방 세종',
    category: 'Yeonseo / Craft',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=400&auto=format&fit=crop'
  },
  {
    rank: 5,
    name: '로컬허브 나성',
    category: 'Naseong / Space',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop'
  },
  {
    rank: 6,
    name: '밀마루 베이커리',
    category: 'Areum / F&B',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop'
  }
];

export default function MapRankingSection() {
  return (
    <section className="ranking-section-container">
      <div className="container">
        <h2 className="section-title-lbl en-title animate-fade-in">Sejong Local Map Hotspots</h2>
        <p className="section-subtitle">현재 세종 로컬 맵에서 주목받는 실시간 브랜드 공간 순위</p>

        <div className="ranking-grid">
          {MOCK_RANKINGS.map((item) => (
            <div key={item.rank} className="ranking-card glass-panel transition-base">
              <Link href="/archive" className="ranking-card-inner">
                <div className="ranking-image-container">
                  <span className="rank-badge">{item.rank}</span>
                  <img src={item.image} alt={item.name} className="ranking-thumb" />
                </div>
                <div className="ranking-info">
                  <span className="ranking-cat en-title">{item.category}</span>
                  <h3 className="ranking-name">{item.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ranking-section-container {
          padding: 80px 0;
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-gray-light);
        }

        .section-title-lbl {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-emerald-light);
          letter-spacing: 2px;
          margin-bottom: 10px;
        }

        .section-subtitle {
          font-size: 15px;
          color: var(--color-gray-dark);
          margin-bottom: 40px;
        }

        .ranking-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .ranking-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .ranking-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .ranking-card {
          padding: 12px;
          border-radius: var(--border-radius-md);
          background: var(--color-sand-light);
        }

        .ranking-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-medium);
          background: var(--color-white);
          border-color: var(--color-emerald-light);
        }

        .ranking-card-inner {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ranking-image-container {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
        }

        .rank-badge {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          background-color: var(--color-emerald-deep);
          color: var(--color-sand-warm);
          font-family: var(--font-family-condensed);
          font-size: 14px;
          font-weight: 800;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom-right-radius: var(--border-radius-sm);
        }

        .ranking-card:nth-child(1) .rank-badge,
        .ranking-card:nth-child(2) .rank-badge,
        .ranking-card:nth-child(3) .rank-badge {
          background-color: var(--color-orange-accent);
        }

        .ranking-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ranking-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ranking-cat {
          font-size: 10px;
          font-weight: 700;
          color: var(--color-emerald-light);
          letter-spacing: 0.5px;
        }

        .ranking-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-charcoal-deep);
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
}
