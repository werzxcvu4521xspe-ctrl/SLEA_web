import Image from 'next/image';
import Link from 'next/link';

const DEFAULT_ARCHIVE_IMAGE = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=70&w=900&auto=format&fit=crop';

function canUseNextImage(src) {
  if (!src) return false;
  if (src.startsWith('/')) return true;

  try {
    return new URL(src).hostname === 'images.unsplash.com';
  } catch {
    return false;
  }
}

export default function ArchiveCard({ archive, preload = false }) {
  const { id, company_name, representative, category, image_url, address, short_desc } = archive;
  const imageSrc = image_url || DEFAULT_ARCHIVE_IMAGE;
  const useOptimizedImage = canUseNextImage(imageSrc);

  // Render a clean category label style
  const formattedLocation = address ? address.split(' ').slice(0, 2).join(' ') : '세종특별자치시';

  return (
    <div className="archive-card-container transition-base">
      <Link href={`/archive/${id}`} className="card-link">
        {/* Card Image */}
        <div className="card-image-box">
          {useOptimizedImage ? (
            <Image
              src={imageSrc}
              alt={`${company_name} 대표 이미지`}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              quality={58}
              className="card-image"
              preload={preload}
              loading={preload ? 'eager' : 'lazy'}
              fetchPriority={preload ? 'high' : 'auto'}
            />
          ) : (
            <img
              src={imageSrc}
              alt={`${company_name} 대표 이미지`}
              className="card-image"
              width="600"
              height="375"
              loading={preload ? 'eager' : 'lazy'}
              fetchPriority={preload ? 'high' : 'auto'}
              decoding="async"
            />
          )}
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
    </div>
  );
}
