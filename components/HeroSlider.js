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
    title: '조치원 복숭아의 맛있는 변신, 로컬 디저트 카페 "도원"',
    category: 'F&B / 로컬브랜드',
    desc: '3대째 이어져 온 복숭아 과수원의 청년들이 만든 세종의 대표 로컬 스위츠',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    link: '/archive'
  },
  {
    id: 2,
    title: '세종 조치원 유휴 양조장, 복합문화공간 "조치원 브루어리"로 태어나다',
    category: 'CULTURE / 재생공간',
    desc: '버려진 공간에 음악과 수제 맥주의 활기를 불어넣은 세종의 젊은 로컬 크리에이터들',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    link: '/archive'
  },
  {
    id: 3,
    title: '전통 백자의 미학을 재해석하는 라이프스타일 브랜드 "공방 세종"',
    category: 'CRAFT / 로컬제조',
    desc: '현대 생활양식에 자연스럽게 스며드는 모던 세종 도자기 라인업',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1200&auto=format&fit=crop',
    link: '/archive'
  },
  {
    id: 4,
    title: '스마트 물류 테크로 세종의 신선함을 배달하는 스타트업 "로컬 고"',
    category: 'TECH / 신선물류',
    desc: '세종시 농가와 소상공인을 직접 연결하는 친환경 직배송 플랫폼 서비스',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    link: '/archive'
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
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.65)), url(${slide.image})` }}
            >
              <div className="slide-content container">
                <span className="slide-category en-title">{slide.category}</span>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-desc">{slide.desc}</p>
                <Link href={slide.link} className="slide-btn">
                  기획 스토리 읽기 <span>→</span>
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
          height: 600px;
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
          margin-left: 0;
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
          letter-spacing: -1px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        @media (min-width: 768px) {
          .slide-title {
            font-size: 46px;
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
          transition: all 0.2s ease;
          background-color: rgba(255, 255, 255, 0.05);
        }

        .slide-btn:hover {
          background-color: var(--color-white);
          color: var(--color-charcoal-medium);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
