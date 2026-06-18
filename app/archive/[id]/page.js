import { supabase } from '@/lib/supabaseClient';
import MapWidget from '@/components/MapWidget';
import ArchiveCard from '@/components/ArchiveCard';
import Link from 'next/link';

const FALLBACK_ARCHIVES = [
  {
    id: '1',
    company_name: '디저트 카페 도원',
    representative: '이민수',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    address: '세종특별자치시 조치원읍 으뜸길 12',
    short_desc: '조치원 특산물 복숭아를 활용한 시그니처 잼과 구움과자를 만드는 디저트 숍',
    story: `## 복숭아 향 가득한 조치원의 디저트 명소, "도원"

조치원은 예로부터 전국적으로 유명한 복숭아 주산지입니다. 디저트 카페 **도원**은 조치원 복숭아의 맛과 향을 사계절 내내 즐길 수 있도록 청년 창업가 이민수 대표가 설립한 브랜드입니다.

### 지역 농가와의 상생, 복숭아 원물 수급
도원은 조치원 지역 복숭아 과수원들과 직접 계약재배를 맺고 신선한 복숭아를 공급받습니다. 수확기에 들어오는 당도 높은 황도와 백도를 급속 냉동하거나 전통 수제 잼으로 끓여내어, 일 년 내내 복숭아 타르트, 복숭아 피낭시에, 그리고 복숭아 크림 라떼 등 시그니처 메뉴를 선보이고 있습니다.

### 청년들의 감각으로 재해석한 전통
카페 내부는 오래된 과수원 목재 자재를 재활용한 숲속 스타일의 인테리어로, 조치원의 평화롭고 따스한 로컬 감성을 고스란히 느낄 수 있습니다. 단순히 디저트를 파는 공간을 넘어 세종 로컬 크리에이터들의 모임 공간이자 클래스 운영 허브로 기능합니다.`,
    website_url: 'https://sejong.go.kr',
    sns_url: 'https://instagram.com'
  },
  {
    id: '2',
    company_name: '조치원 브루어리',
    representative: '김유리',
    category: 'Culture',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    address: '세종특별자치시 조치원읍 양조장길 45',
    short_desc: '100년 된 막걸리 양조장을 개조하여 세종의 수제 맥주와 문화를 기획하는 공간',
    story: `## 100년 전 양조장, 복합 문화공간으로 다시 태어나다

**조치원 브루어리**는 일제강점기 시절 설립되어 방치되어 있던 근대 건축물인 양조장 부지를 청년 예술가와 양조사들이 리모델링하여 만든 복합 문화 맥주 펍입니다.

### 전통 양조 기술과 현대 크래프트 비어의 만남
조치원 브루어리는 옛 양조장에서 사용하던 전통 누룩 효모 기법을 차용해 만든 '세종 골든 에일'과 조치원 복숭아를 발효시켜 독특한 향을 내는 '도원 복숭아 맥주'를 자체 양조합니다.

### 문화를 매개로 한 커뮤니티 활성화
매월 마지막 주 토요일에는 지역 인디 뮤지션들과의 협업으로 '양조장 인디 페스티벌'을 개최합니다. 맥주 한 잔과 함께 지역민들과 관광객들이 허물없이 소통하는 새로운 로컬 문화 거점으로 자리매김하고 있습니다.`,
    website_url: 'https://sejong.go.kr',
    sns_url: 'https://instagram.com'
  },
  {
    id: '3',
    company_name: '한옥 찻집 단차',
    representative: '박성주',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
    address: '세종특별자치시 금남면 한옥마을길 7',
    short_desc: '세종시 농가에서 자란 찻잎으로 로컬 차 문화 클래스를 운영하는 한옥 다원',
    story: `## 현대인을 위한 세종의 숨은 안식처, "단차"

세종시 금남면 한적한 골목 끝자락에 위치한 **단차**는 한옥의 아름다움을 현대적인 감각으로 재구성한 로컬 차 전문점입니다.

### 로컬 작물로 우려내는 건강함
단차는 금남면 농가에서 직접 무농약으로 재배한 민들레, 국화, 보리 등을 티블렌딩 마스터가 최적의 비율로 로스팅하여 차로 제공합니다.

### 차(Tea)를 통한 명상과 다도 체험
매주 일요일 오전에는 일상의 피로를 덜어내는 전통 다도 클래스를 운영합니다. 고즈넉한 한옥 마당을 바라보며 나를 돌아보는 시간을 선사합니다.`,
    website_url: 'https://sejong.go.kr',
    sns_url: 'https://instagram.com'
  },
  {
    id: '4',
    company_name: '공방 세종',
    representative: '정소민',
    category: 'Craft',
    image_url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1200&auto=format&fit=crop',
    address: '세종특별자치시 연서면 봉암길 88',
    short_desc: '세종의 자연 흙과 재료로 일상 식기와 모던 도자 예술을 만드는 공예 브랜드',
    story: `## 세종의 흙으로 빚어낸 따스한 식기, "공방 세종"

**공방 세종**은 연서면의 도예 작가들이 중심이 되어 설립한 수제 도자기 공방입니다. 세종시 지역 토양의 거친 질감을 자연스럽게 드러내는 디자인이 특징입니다.

### 자연주의 생활 식기 브랜드
매일 사용하는 그릇과 컵 하나에도 자연의 숨결을 담고자 합니다. 환경 호르몬 없는 친환경 흙과 천연 유약만을 사용하여 제품을 빚어냅니다.

### 도예 아카데미 및 체험 코스
남녀노소 누구나 흙을 직접 만지며 힐링할 수 있는 원데이 도예 클래스를 매일 운영하고 있습니다.`,
    website_url: 'https://sejong.go.kr',
    sns_url: 'https://instagram.com'
  },
  {
    id: '5',
    company_name: '로컬허브 나성',
    representative: '최준혁',
    category: 'Space',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 나성로 123',
    short_desc: '세종시 로컬 창업가와 프리랜서들이 함께 성장하는 공유 오피스 및 코워킹 라운지',
    story: `## 세종 로컬 크리에이터의 연대와 협업, "로컬허브 나성"

**로컬허브 나성**은 세종시 핵심 상권인 나성동에 위치한 로컬 창업 전용 코워킹 스페이스입니다.

### 창업가를 위한 스마트 인프라
비즈니스에 최적화된 고속 인터넷, 회의실, 촬영 스튜디오 공간을 제공하여 1인 기업과 초기 스타트업의 원활한 업무를 돕습니다.

### 네트워킹 및 정보 공유 허브
매월 다양한 네트워킹 데이와 전문가 세미나를 주최하여 청년 창업가들이 겪는 고민을 함께 풀고 비즈니스 협업을 매칭하고 있습니다.`,
    website_url: 'https://sejong.go.kr',
    sns_url: 'https://instagram.com'
  },
  {
    id: '6',
    company_name: '밀마루 베이커리',
    representative: '황정민',
    category: 'F&B',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
    address: '세종특별자치시 아름동 보듬3로 8',
    short_desc: '세종 쌀로 만든 쌀식빵과 친환경 효모종을 구워내는 건강한 베이커리 연구소',
    story: `## 매일 건강하게 구워내는 밀마루 베이커리

**밀마루 베이커리**는 세종시 아름동 주민들의 큰 사랑을 받고 있는 친환경 로컬 베이커리 브랜드입니다.

### 세종 쌀과 로컬 밀의 맛있는 배합
수입 밀가루 대신 세종 지역 농가에서 수확한 세종 쌀가루와 앉은뱅이밀을 주재료로 사용하여 소화가 잘되고 쫄깃한 식감의 빵을 구워냅니다.

### 건강한 빵 문화 전파
버터, 달걀, 우유를 넣지 않은 다양한 비건 빵 라인업을 제공하여 알레르기가 있거나 건강 관리를 하는 분들도 걱정 없이 즐길 수 있습니다.`,
    website_url: 'https://sejong.go.kr',
    sns_url: 'https://instagram.com'
  }
];

export default async function ArchiveDetailPage({ params }) {
  const { id } = await params;
  
  let archive = null;
  let otherArchives = [];
  let isFallback = false;

  try {
    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      isFallback = true;
    } else {
      archive = data;
    }

    const { data: related } = await supabase
      .from('archives')
      .select('*')
      .eq('status', 'approved')
      .neq('id', id)
      .limit(3);
    
    otherArchives = related || [];
  } catch (e) {
    isFallback = true;
  }

  if (isFallback) {
    archive = FALLBACK_ARCHIVES.find((item) => item.id === id) || FALLBACK_ARCHIVES[0];
    otherArchives = FALLBACK_ARCHIVES.filter((item) => item.id !== id).slice(0, 3);
  }

  return (
    <div className="detail-page-wrapper">
      <div 
        className="detail-hero-banner"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${archive.image_url})` }}
      >
        <div className="container hero-content">
          <Link href="/archive" className="back-link">← 아카이브 목록으로</Link>
          <span className="category-tag en-title">{archive.category}</span>
          <h1 className="detail-title">{archive.company_name}</h1>
          <p className="detail-sub">{archive.short_desc}</p>
        </div>
      </div>

      <div className="detail-main-layout container">
        <div className="detail-info-sidebar">
          <div className="info-card glass-panel">
            <h3 className="sidebar-title">브랜드 정보</h3>
            <ul className="info-list">
              <li>
                <span className="info-lbl">대표 크리에이터</span>
                <span className="info-val">{archive.representative} 대표</span>
              </li>
              <li>
                <span className="info-lbl">구분 / 분야</span>
                <span className="info-val">{archive.category}</span>
              </li>
              {archive.website_url && (
                <li>
                  <span className="info-lbl">공식 웹사이트</span>
                  <a href={archive.website_url} target="_blank" rel="noopener noreferrer" className="info-link-val">
                    바로가기 🔗
                  </a>
                </li>
              )}
              {archive.sns_url && (
                <li>
                  <span className="info-lbl">소셜 미디어 (SNS)</span>
                  <a href={archive.sns_url} target="_blank" rel="noopener noreferrer" className="info-link-val">
                    인스타그램 바로가기 📸
                  </a>
                </li>
              )}
            </ul>
          </div>

          <MapWidget address={archive.address} companyName={archive.company_name} />
        </div>

        <article className="detail-story-content">
          <div className="story-wrapper">
            {archive.story ? (
              archive.story.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="story-h2">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="story-h3">{paragraph.replace('### ', '')}</h3>;
                }
                return <p key={index} className="story-paragraph">{paragraph}</p>;
              })
            ) : (
              <p>상세 브랜드 스토리가 준비 중입니다.</p>
            )}
          </div>
        </article>
      </div>

      <section className="related-showcase">
        <div className="container">
          <h2 className="related-showcase-title">세종 로컬의 다른 매력적인 브랜드</h2>
          <div className="grid-3">
            {otherArchives.map((item) => (
              <ArchiveCard key={item.id} archive={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
