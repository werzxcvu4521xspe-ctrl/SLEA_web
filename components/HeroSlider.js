'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from 'next/link';

// Swiper styles
import 'swiper/css';

const MOCK_SLIDES = [
  {
    id: 1,
    title: '세종 로컬 창업가를 연결하는 공식 협회 플랫폼',
    category: 'Association / Sejong Local',
    desc: '공지, 세로 데이, 회원사 콘텐츠, AI 창업 지원, 멘토링, 쇼핑, 토크 채널을 한곳에서 연결합니다.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
    link: '/signup',
    cta: '협회 회원으로 시작하기'
  },
  {
    id: 2,
    title: '세로 회원사의 브랜드 이야기를 콘텐츠로 알립니다',
    category: 'Member Stories / Sero',
    desc: '회원 기업별 인터뷰 영상과 SNS 콘텐츠를 검색 가능한 브랜드 이야기로 정리합니다.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1400&auto=format&fit=crop',
    link: '/sero-members',
    cta: '세로 회원사 보기'
  },
  {
    id: 3,
    title: '매월 열리는 세로데이에서 협업의 다음 기회를 만듭니다',
    category: 'Network / Sero Day',
    desc: '정기 네트워킹, 1:1 멘토링, 실무 교육, 팝업마켓으로 창업가의 성장을 실제 기회로 바꿉니다.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400&auto=format&fit=crop',
    link: '/sero-day',
    cta: '세로 데이 신청하기'
  },
  {
    id: 4,
    title: '기업 정보를 넣고 사업계획서 초안을 빠르게 만듭니다',
    category: 'AI Start / Support',
    desc: '세로 AI 스타트에서 사업계획서 초안과 정부지원사업 추천을 한 번에 확인합니다.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop',
    link: '/sero-ai-start',
    cta: 'AI 스타트 열기'
  }
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="hero-slider-wrapper">
      <div className="slide-counter-badge">
        <span className="current">{activeIndex + 1}</span>
        <span className="slash"> / </span>
        <span className="total">{MOCK_SLIDES.length}</span>
      </div>

      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="hero-swiper"
      >
        {MOCK_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="slide-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-tint" aria-hidden="true" />
              <div className="slide-content container">
                <span className="slide-category en-title">{slide.category}</span>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-desc">{slide.desc}</p>
                <Link href={slide.link} className="slide-btn">
                  {slide.cta} <span>→</span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .hero-slider-wrapper {
          position: relative;
          width: 100%;
          height: 640px;
          overflow: hidden;
          background-color: var(--color-charcoal-medium);
        }

        .slide-counter-badge {
          position: absolute;
          top: 40px;
          right: 40px;
          z-index: 10;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--color-white);
          padding: 8px 18px;
          font-family: var(--font-family-condensed);
          font-size: 14px;
          font-weight: 700;
          border-radius: var(--border-radius-full);
          letter-spacing: 1px;
        }

        .slide-counter-badge .current {
          color: var(--color-orange-accent);
        }

        .slide-counter-badge .total {
          color: var(--color-gray-light);
        }

        :global(.hero-swiper) {
          width: 100%;
          height: 100%;
        }

        :global(.hero-swiper .swiper-wrapper),
        :global(.hero-swiper .swiper-slide) {
          height: 100%;
        }

        .slide-bg {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding-bottom: 80px;
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
          max-width: 800px;
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
            font-size: 44px;
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

          :global(.hero-swiper),
          :global(.hero-swiper .swiper-wrapper),
          :global(.hero-swiper .swiper-slide) {
            height: auto !important;
            min-height: 0 !important;
          }

          .slide-counter-badge {
            display: none;
          }

          .slide-bg {
            height: auto !important;
            min-height: 360px;
            align-items: flex-end;
            padding: 70px 0 34px;
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
