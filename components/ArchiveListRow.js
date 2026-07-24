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
    </div>
  );
}
