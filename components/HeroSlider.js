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
    desc: '회원 브랜드 아카이브, 정기 네트워킹, 창업 지원 자료, 파트너십을 한곳에서 연결합니다.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
    link: '/signup',
    cta: '협회 회원으로 시작하기'
  },
  {
    id: 2,
    title: '창업가의 브랜드 이야기를 아카이브하고 알립니다',
    category: 'Archive / Brand Story',
    desc: '세종의 F&B, 문화공간, 공예, 교육, 로컬 제조 브랜드를 검색 가능한 이야기로 정리합니다.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1400&auto=format&fit=crop',
    link: '/archive',
    cta: '창업가 아카이브 보기'
  },
  {
    id: 3,
    title: '매월 열리는 세로데이에서 협업의 다음 기회를 만듭니다',
    category: 'Network / Sero Day',
    desc: '정기 네트워킹, 1:1 멘토링, 실무 교육, 팝업마켓으로 창업가의 성장을 실제 기회로 바꿉니다.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400&auto=format&fit=crop',
    link: '/activities',
    cta: '협회활동 살펴보기'
  },
  {
    id: 4,
    title: '공공기관과 지역 파트너가 함께 키우는 로컬 생태계',
    category: 'Partnership / Support',
    desc: '세종시 지원사업, 대학·기관 협력, 자료실과 제휴 제안을 통해 지속 가능한 판로를 넓힙니다.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop',
    link: '/support',
    cta: '지원 자료 확인하기'
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
              style={{ backgroundImage: `linear-gradient(105deg, rgba(17,50,116,0.94) 0%, rgba(20,86,200,0.8) 42%, rgba(8,167,216,0.56) 68%, rgba(0,191,99,0.42) 100%), url(${slide.image})` }}
            >
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
          display: flex;
          align-items: flex-end;
          padding-bottom: 80px;
        }

        .slide-content {
          color: var(--color-white);
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
          font-size: 32px;
          line-height: 1.4;
          font-weight: 800;
          letter-spacing: 0;
          word-break: keep-all;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          max-width: 760px;
        }

        @media (min-width: 768px) {
          .slide-title {
            font-size: 50px;
          }
        }

        .slide-desc {
          font-size: 16px;
          line-height: 1.6;
          color: var(--color-gray-light);
          max-width: 600px;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
        }

        @media (min-width: 768px) {
          .slide-desc {
            font-size: 18px;
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
            font-size: 23px;
            line-height: 1.22;
          }

          .slide-desc {
            max-width: 94%;
            font-size: 14.5px;
            line-height: 1.55;
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
