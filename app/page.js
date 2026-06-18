import HeroSlider from '@/components/HeroSlider';
import CabinetSection from '@/components/CabinetSection';
import MapRankingSection from '@/components/MapRankingSection';
import ArchiveCard from '@/components/ArchiveCard';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

// Fallback Mock Data if Supabase fetch is empty/unconfigured
const FALLBACK_ARCHIVES = [
  {
    id: '1',
    company_name: '디저트 카페 도원',
    representative: '이민수',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 조치원읍 으뜸길 12',
    short_desc: '조치원 특산물 복숭아를 활용한 시그니처 잼과 구움과자를 만드는 디저트 숍'
  },
  {
    id: '2',
    company_name: '조치원 브루어리',
    representative: '김유리',
    category: 'Culture',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 조치원읍 양조장길 45',
    short_desc: '100년 된 막걸리 양조장을 개조하여 세종의 수제 맥주와 문화를 기획하는 공간'
  },
  {
    id: '3',
    company_name: '한옥 찻집 단차',
    representative: '박성주',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 금남면 한옥마을길 7',
    short_desc: '세종시 농가에서 자란 찻잎으로 로컬 차 문화 클래스를 운영하는 한옥 다원'
  },
  {
    id: '4',
    company_name: '공방 세종',
    representative: '정소민',
    category: 'Craft',
    image_url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 연서면 봉암길 88',
    short_desc: '세종의 자연 흙과 재료로 일상 식기와 모던 도자 예술을 만드는 공예 브랜드'
  },
  {
    id: '5',
    company_name: '로컬허브 나성',
    representative: '최준혁',
    category: 'Space',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 나성로 123',
    short_desc: '세종시 로컬 창업가와 프리랜서들이 함께 성장하는 공유 오피스 및 코워킹 라운지'
  },
  {
    id: '6',
    company_name: '밀마루 베이커리',
    representative: '황정민',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 아름동 보듬3로 8',
    short_desc: '세종 쌀로 만든 쌀식빵 and 친환경 효모종을 구워내는 건강한 베이커리 연구소'
  }
];

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let displayArchives = [];

  try {
    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !data || data.length === 0) {
      displayArchives = FALLBACK_ARCHIVES;
    } else {
      displayArchives = data;
    }
  } catch (e) {
    displayArchives = FALLBACK_ARCHIVES;
  }

  return (
    <div className="home-page-container">
      {/* 1. Hero Swiper Slider */}
      <HeroSlider />

      {/* 2. Hot Archives Showcase Grid */}
      <section className="showcase-section">
        <div className="container">
          <div className="showcase-header">
            <div>
              <span className="section-label en-title">New Archives</span>
              <h2 className="showcase-title">새로 등록된 세종 창업가</h2>
            </div>
            <Link href="/archive" className="view-all-link">
              전체 보기 <span>→</span>
            </Link>
          </div>

          <div className="grid-3">
            {displayArchives.map((archive) => (
              <ArchiveCard key={archive.id} archive={archive} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Project Cabinet Section */}
      <CabinetSection />

      {/* 4. Local Map Rankings */}
      <MapRankingSection />

      {/* 5. Association Newsletter Promotion */}
      <section className="promo-section">
        <div className="container promo-inner glass-panel">
          <div className="promo-text">
            <span className="promo-tag en-title">Newsletter</span>
            <h2 className="promo-title">세종 로컬 창업 뉴스레터 구독</h2>
            <p className="promo-desc">
              매주 목요일 아침, 세종시의 다양한 로컬 브랜드 소식과 창업가 인터뷰, 
              정부/지자체 창업 지원 사업 소식을 엄선해 메일로 발송해 드립니다.
            </p>
          </div>
          <div className="promo-action">
            <Link href="/notice" className="subscribe-btn transition-base">
              뉴스레터 무료 구독 신청하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
