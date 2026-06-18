'use client';

import Link from 'next/link';

export default function ArchiveCard({ archive }) {
  const { id, company_name, representative, category, image_url, address, short_desc } = archive;

  // Render a clean category label style
  const formattedLocation = address ? address.split(' ').slice(0, 2).join(' ') : '세종특별자치시';

  return (
    <div className="archive-card-container transition-base">
      <Link href={`/archive/${id}`} className="card-link">
        {/* Card Image */}
        <div className="card-image-box">
          <img 
            src={image_url || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop'} 
            alt={company_name} 
            className="card-image"
          />
          <span className="card-category-badge">{category}</span>
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="card-meta">
            <span className="card-location">📍 {formattedLocation}</span>
            <span className="card-owner">{representative} 대표</span>
          </div>
          <h3 className="card-title">{company_name}</h3>
          <p className="card-desc">{short_desc}</p>
        </div>
      </Link>

      <style jsx>{`
        .archive-card-container {
          background-color: var(--color-white);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-subtle);
          border: 1px solid var(--color-gray-light);
          display: flex;
          flex-direction: column;
        }

        .archive-card-container:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-medium);
          border-color: var(--color-emerald-light);
        }

        .card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .card-image-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background-color: var(--color-sand-medium);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .archive-card-container:hover .card-image {
          transform: scale(1.05);
        }

        .card-category-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          z-index: 2;
          background-color: var(--color-charcoal-medium);
          color: var(--color-white);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--border-radius-sm);
        }

        .card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .card-title {
          font-size: 19px;
          font-weight: 800;
          color: var(--color-charcoal-deep);
          line-height: 1.4;
          margin-top: 4px;
        }

        .card-desc {
          font-size: 14px;
          line-height: 1.5;
          color: var(--color-gray-dark);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
