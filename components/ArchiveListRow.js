'use client';

import Link from 'next/link';

export default function ArchiveListRow({ archive }) {
  const { id, company_name, representative, category, address, short_desc } = archive;
  const formattedLocation = address ? address.split(' ').slice(0, 2).join(' ') : '세종시';

  return (
    <div className="list-row-container transition-base">
      <Link href={`/archive/${id}`} className="row-link">
        <div className="row-meta">
          <span className="row-location">📍 {formattedLocation}</span>
          <span className="row-category">{category}</span>
        </div>
        <div className="row-main">
          <h3 className="row-title">{company_name}</h3>
          <p className="row-desc">{short_desc}</p>
        </div>
        <div className="row-owner-info">
          <span className="row-owner">{representative} 대표</span>
          <span className="row-arrow">→</span>
        </div>
      </Link>

      <style jsx>{`
        .list-row-container {
          border-bottom: 1px solid var(--color-gray-light);
          background-color: var(--color-white);
        }

        .list-row-container:last-child {
          border-bottom: none;
        }

        .list-row-container:hover {
          background-color: var(--color-sand-light);
        }

        .row-link {
          display: grid;
          grid-template-columns: 1fr;
          padding: 20px 24px;
          gap: 12px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .row-link {
            grid-template-columns: 1.5fr 4fr 1.5fr;
            gap: 24px;
          }
        }

        .row-meta {
          display: flex;
          flex-direction: row;
          gap: 12px;
          font-size: 13px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }

        @media (min-width: 768px) {
          .row-meta {
            flex-direction: column;
            gap: 4px;
          }
        }

        .row-location {
          color: var(--color-emerald-deep);
        }

        .row-category {
          color: var(--color-gray-dark);
        }

        .row-main {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .row-title {
          font-size: 17px;
          font-weight: 800;
          color: var(--color-charcoal-deep);
        }

        .row-desc {
          font-size: 14px;
          color: var(--color-gray-dark);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-owner-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-charcoal-deep);
        }

        .row-arrow {
          font-size: 16px;
          color: var(--color-emerald-medium);
          transition: transform 0.2s ease;
        }

        .list-row-container:hover .row-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
