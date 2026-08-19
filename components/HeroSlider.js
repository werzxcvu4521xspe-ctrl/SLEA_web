'use client';

import Link from 'next/link';

const STATIC_HERO = {
  title: '세종 로컬 창업가를 연결하는 공식 협회 플랫폼',
  category: 'Association / Sejong Local',
  desc: '공지, 세로 데이, 회원사 콘텐츠, AI 창업 지원, 멘토링, 쇼핑, 토크 채널을 한곳에서 연결합니다.',
  image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
  link: '/signup',
  cta: '협회 회원으로 시작하기'
};

export default function HeroSlider() {
  return (
    <div className="hero-slider-wrapper">
      <div 
        className="slide-bg"
        style={{ backgroundImage: `url(${STATIC_HERO.image})` }}
      >
        <div className="slide-tint" aria-hidden="true" />
        <div className="slide-content container">
          <span className="slide-category en-title">{STATIC_HERO.category}</span>
          <h2 className="slide-title">{STATIC_HERO.title}</h2>
          <p className="slide-desc">{STATIC_HERO.desc}</p>
          <Link href={STATIC_HERO.link} className="slide-btn">
            {STATIC_HERO.cta} <span>→</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .hero-slider-wrapper {
          position: relative;
          width: 100%;
          height: clamp(520px, calc(100svh - var(--header-height) - var(--banner-height)), 640px);
          min-height: 520px;
          overflow: hidden;
          background-color: var(--color-charcoal-medium);
        }

        .slide-bg {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          padding: 72px 0;
        }

        .slide-tint {
          position: absolute;
          inset: 0;
          background: rgba(17, 17, 17, 0.66);
        }

        .slide-content {
          color: var(--color-white);
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .slide-category {
          color: var(--color-orange-accent);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          background-color: rgba(255, 87, 34, 0.1);
          padding: 6px 12px;
          border-radius: var(--border-radius-sm);
        }

        .slide-title {
          font-size: 30px;
          line-height: 1.28;
          font-weight: 800;
          letter-spacing: 0;
          word-break: keep-all;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          max-width: 760px;
        }

        @media (min-width: 768px) {
          .slide-title {
            font-size: 40px;
          }
        }

        .slide-desc {
          font-size: 15.5px;
          line-height: 1.64;
          color: var(--color-gray-light);
          max-width: 600px;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
        }

        @media (min-width: 768px) {
          .slide-desc {
            font-size: 17px;
          }
        }

        .slide-btn {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-white);
          border: 1px solid var(--color-white);
          padding: 12px 28px;
          border-radius: var(--border-radius-full);
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          background-color: rgba(255, 255, 255, 0.05);
        }

        .slide-btn:hover {
          background-color: var(--color-white);
          color: var(--color-charcoal-medium);
          transform: translateY(-2px);
        }

        @media (max-width: 767px) {
          .hero-slider-wrapper {
            height: auto !important;
            min-height: 0;
            background-color: transparent;
          }

          .slide-bg {
            height: auto !important;
            min-height: 420px;
            align-items: center;
            padding: 48px 0 38px;
            background-position: center;
          }

          .slide-content {
            gap: 10px;
            max-width: 100%;
          }

          .slide-title {
            max-width: 94%;
            font-size: 22px;
            line-height: 1.26;
          }

          .slide-desc {
            max-width: 94%;
            font-size: 14px;
            line-height: 1.6;
          }

          .slide-category {
            display: none;
          }

          .slide-btn {
            min-height: 48px;
            width: fit-content;
            max-width: 100%;
            padding: 0 24px;
            font-size: 14px;
            margin-top: 4px;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
