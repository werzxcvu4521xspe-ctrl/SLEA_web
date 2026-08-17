import HeroSlider from '@/components/HeroSlider';
import { SERVICE_CATEGORIES } from '@/lib/serviceCategories';
import Link from 'next/link';

const QUICK_LINKS = SERVICE_CATEGORIES.map((category) => ({
  title: category.title,
  desc: category.description,
  href: category.href,
  tag: category.eyebrow
}));

export const revalidate = 60; // Revalidate every minute

export default function HomePage() {
  return (
    <div className="home-page-container">
      <HeroSlider />

      <section className="home-intro-section">
        <div className="container">
          <div className="home-intro-grid">
            <div className="home-intro-copy">
              <span className="section-label en-title">Simple Service Map</span>
              <h1>SELO는 7개의 핵심 서비스로 운영됩니다.</h1>
              <p>
                공지, 네트워킹, 회원사 콘텐츠, AI 창업 지원, 멘토링, 쇼핑, 토크까지
                필요한 입구를 한 화면에서 바로 이동할 수 있게 정리했습니다.
              </p>
              <div className="home-intro-actions">
                <Link href="/signup" className="primary-cta-link">
                  회원가입 시작하기
                </Link>
                <Link href="/notice" className="secondary-cta-link">
                  공지사항 보기
                </Link>
              </div>
            </div>
          </div>

          <div className="quick-link-grid">
            {QUICK_LINKS.map((item) => (
              <Link href={item.href} className="quick-link-card" key={item.title}>
                <span className="quick-link-tag en-title">{item.tag}</span>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
                <span className="quick-link-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
