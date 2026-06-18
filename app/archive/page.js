import ArchiveCategoryTabs from '@/components/ArchiveCategoryTabs';
import ArchiveCard from '@/components/ArchiveCard';
import ArchiveListRow from '@/components/ArchiveListRow';
import ArchiveFilterBar from '@/components/ArchiveFilterBar';
import { supabase } from '@/lib/supabaseClient';

const FALLBACK_ARCHIVES = [
  {
    id: '1',
    company_name: '디저트 카페 도원',
    representative: '이민수',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 조치원읍 으뜸길 12',
    short_desc: '조치원 특산물 복숭아를 활용한 시그니처 잼과 구움과자를 만드는 디저트 숍',
    years: '2_3',
    features: ['class', 'parking']
  },
  {
    id: '2',
    company_name: '조치원 브루어리',
    representative: '김유리',
    category: 'Culture',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 조치원읍 양조장길 45',
    short_desc: '100년 된 막걸리 양조장을 개조하여 세종의 수제 맥주와 문화를 기획하는 공간',
    years: 'under_1',
    features: ['rental', 'parking']
  },
  {
    id: '3',
    company_name: '한옥 찻집 단차',
    representative: '박성주',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 금남면 한옥마을길 7',
    short_desc: '세종시 농가에서 자란 찻잎으로 로컬 차 문화 클래스를 운영하는 한옥 다원',
    years: '4_5',
    features: ['class', 'parking']
  },
  {
    id: '4',
    company_name: '공방 세종',
    representative: '정소민',
    category: 'Craft',
    image_url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 연서면 봉암길 88',
    short_desc: '세종의 자연 흙과 재료로 일상 식기와 모던 도자 예술을 만드는 공예 브랜드',
    years: 'over_5',
    features: ['class']
  },
  {
    id: '5',
    company_name: '로컬허브 나성',
    representative: '최준혁',
    category: 'Space',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 나성로 123',
    short_desc: '세종시 로컬 창업가와 프리랜서들이 함께 성장하는 공유 오피스 및 코워킹 라운지',
    years: '2_3',
    features: ['rental', 'parking']
  },
  {
    id: '6',
    company_name: '밀마루 베이커리',
    representative: '황정민',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 아름동 보듬3로 8',
    short_desc: '세종 쌀로 만든 쌀식빵과 친환경 효모종을 구워내는 건강한 베이커리 연구소',
    years: 'over_5',
    features: ['parking']
  }
];

export default async function ArchivePage({ searchParams }) {
  const params = await searchParams;
  const category = params.category || '';
  const search = params.search || '';
  const regions = params.regions || '';
  const years = params.years || '';
  const features = params.features || '';
  const view = params.view || 'grid';
  const sort = params.sort || 'latest';

  let archives = [];
  let isFallback = false;

  try {
    let query = supabase
      .from('archives')
      .select('*')
      .eq('status', 'approved');

    if (category) {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,representative.ilike.%${search}%,short_desc.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      isFallback = true;
    } else {
      archives = data;
    }
  } catch (e) {
    isFallback = true;
  }

  if (isFallback) {
    archives = FALLBACK_ARCHIVES.filter((item) => {
      if (category && item.category !== category) return false;

      if (search) {
        const query = search.toLowerCase();
        const matchesName = item.company_name.toLowerCase().includes(query);
        const matchesRep = item.representative.toLowerCase().includes(query);
        const matchesDesc = item.short_desc.toLowerCase().includes(query);
        if (!matchesName && !matchesRep && !matchesDesc) return false;
      }

      if (regions) {
        const regionList = regions.split(',');
        const matchesRegion = regionList.some((r) => item.address.includes(r));
        if (!matchesRegion) return false;
      }

      if (years) {
        const yearList = years.split(',');
        if (!yearList.includes(item.years)) return false;
      }

      if (features) {
        const featList = features.split(',');
        const matchesFeatures = featList.every((f) => item.features?.includes(f));
        if (!matchesFeatures) return false;
      }

      return true;
    });

    if (sort === 'latest') {
      archives = [...archives].reverse();
    }
  }

  return (
    <div className="archive-page-wrapper">
      <ArchiveCategoryTabs />

      <div className="archive-content-container container">
        <ArchiveFilterBar totalCount={archives.length} />

        {archives.length > 0 ? (
          view === 'list' ? (
            <div className="list-layout-box">
              {archives.map((item) => (
                <ArchiveListRow key={item.id} archive={item} />
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {archives.map((item) => (
                <ArchiveCard key={item.id} archive={item} />
              ))}
            </div>
          )
        ) : (
          <div className="empty-results-box">
            <span className="empty-icon">🔍</span>
            <h3>조건에 맞는 창업가 브랜드가 없습니다.</h3>
            <p>검색어나 상세 필터 조건을 변경해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
