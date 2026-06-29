'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const STORIES = [
  { id: 1, title: '복숭아의 재탄생, 조치원을 구운 과자로 브랜딩하다', brand: '디저트 카페 도원', rep: '이민수 대표', type: '성공사례', summary: '조치원 농가와의 직접 상생 계약을 체결하여 낙과를 프리미엄 수제 시그니처 잼으로 변모시키고, 연 매출 200% 성장을 이룬 스토리.', text: '카페 도원의 시작은 미미했습니다. 하지만 지역 농가에서 버려지는 맛 좋은 복숭아를 활용하기 시작하면서 브랜드의 아이덴티티가 확실해졌습니다. 단순 디저트 숍이 아닌 세종의 농업 유산을 굽는 공간으로 소통하고 있습니다.' },
  { id: 2, title: '100년 양조장 공간에 현대적 펍을 결합해 로컬 랜드마크가 되기까지', brand: '조치원 브루어리', rep: '김유리 대표', type: '대표 인터뷰', summary: '버려진 폐막걸리 주조장을 복합 청년 기획 공간으로 부활시키며 행정자치부 로컬창업 우수사례로 선정된 비결 공유.', text: '과거 막걸리 냄새로 진동하던 100년 된 목조 건물을 부수지 않고, 역사의 결을 살리되 현대인들이 맥주를 편하게 마실 수 있도록 기획했습니다. 이제는 대전, 오송 등 타지역에서도 찾아오는 로컬 명소로 발돋움했습니다.' }
];

const VIDEOS = [
  { id: 1, title: '세종로컬창업가협회 공식 브랜드 필름 2026', duration: '2:15', category: '협회 영상', img: 'https://images.unsplash.com/photo-1542204172-e70528091b50?q=80&w=400&auto=format&fit=crop' },
  { id: 2, title: '조치원 브루어리 대표 김유리 창업 성공 인터뷰', duration: '5:40', category: '인터뷰 영상', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop' },
  { id: 3, title: '세종 로컬 팝업그로잉마켓 생생한 스케치 현장', duration: '1:30', category: '행사 영상', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop' }
];

const SHORTS = [
  { id: 1, title: '3초만에 반하는 조치원 복숭아 병조림 ASMR 🍑', views: '1.2만회', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop' },
  { id: 2, title: '100년 양조장 펍 구석구석 인테리어 꿀팁 대공개 🍺', views: '8,400회', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=300&auto=format&fit=crop' },
  { id: 3, title: '세종시 대표 한옥 찻집에서 차 마시는 올바른 방법 🍵', views: '5,600회', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=300&auto=format&fit=crop' },
  { id: 4, title: '친환경 도자 식기 물레 성형 15초 챌린지 🏺', views: '2.3만회', img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=300&auto=format&fit=crop' }
];

function PRContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'intro';
  const [activeTab, setActiveTab] = useState(tabParam);

  // Active Story modal / detail
  const [selectedStory, setSelectedStory] = useState(null);
  // Video player modal
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.push(`/pr?tab=${tabName}`, { scroll: false });
  };

  return (
    <div className="pr-page-wrapper">
      {/* Banner */}
      <section className="page-hero-banner">
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>PR Center</span>
          <h1 className="page-hero-title">기업홍보센터</h1>
          <p className="page-hero-desc">
            세종을 가꾸는 브랜드들의 비하인드 스토리와 브이로그. <br />
            진정성 있는 대표자 인터뷰, 감성 홍보 영상, 그리고 숏폼 쇼츠 콘텐츠를 전합니다.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="nav-tab-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
            onClick={() => handleTabChange('intro')}
          >
            기업 소개 & 성공사례
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => handleTabChange('videos')}
          >
            홍보영상 & 쇼츠
          </button>
        </div>

        {/* Tab 1: Stories */}
        {activeTab === 'intro' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="grid-2">
              {STORIES.map(story => (
                <div 
                  key={story.id} 
                  className="glass-panel" 
                  style={{ padding: '30px', backgroundColor: 'var(--color-white)', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-emerald">{story.type}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-orange-accent)' }}>{story.brand}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', lineHeight: '1.4' }}>{story.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', lineHeight: '1.6', flexGrow: 1 }}>{story.summary}</p>
                  
                  <button 
                    type="button"
                    className="view-all-link"
                    style={{ alignSelf: 'flex-start', fontSize: '13px', fontWeight: '800', marginTop: '12px', border: 'none', cursor: 'pointer' }}
                    onClick={() => setSelectedStory(story)}
                  >
                    스토리 인터뷰 읽기 ➔
                  </button>
                </div>
              ))}
            </div>

            {/* Story Modal */}
            {selectedStory && (
              <div className="write-form-overlay" onClick={() => setSelectedStory(null)}>
                <div 
                  className="glass-panel animate-fade-in" 
                  style={{ maxWidth: '600px', width: '100%', padding: '40px', backgroundColor: 'var(--color-white)', position: 'relative' }}
                  onClick={e => e.stopPropagation()}
                >
                  <button 
                    type="button" 
                    style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '20px', fontWeight: 'bold' }}
                    onClick={() => setSelectedStory(null)}
                  >
                    ✕
                  </button>
                  <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>{selectedStory.type}</span>
                  <h2 style={{ fontSize: '22px', color: 'var(--color-charcoal-deep)', marginBottom: '6px', lineHeight: '1.3' }}>{selectedStory.title}</h2>
                  <span style={{ fontSize: '13.5px', color: 'var(--color-gray-medium)', fontWeight: '700', display: 'block', marginBottom: '20px' }}>
                    {selectedStory.brand} | {selectedStory.rep}
                  </span>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                    <p style={{ fontSize: '14.5px', lineHeight: '1.8', color: 'var(--color-gray-dark)', whiteSpace: 'pre-line', textAlign: 'justify' }}>
                      {selectedStory.text}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Videos & Shorts */}
        {activeTab === 'videos' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {/* Promo Videos */}
            <div>
              <h3 style={{ fontSize: '20px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '24px' }}>
                🎬 고품격 홍보 및 스케치 영상관
              </h3>
              <div className="grid-3">
                {VIDEOS.map(vid => (
                  <div 
                    key={vid.id} 
                    className="glass-panel" 
                    style={{ backgroundColor: 'var(--color-white)', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => setPlayingVideo(vid)}
                  >
                    <div 
                      style={{ 
                        height: '180px', 
                        backgroundImage: `url("${vid.img}")`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyPath: 'center', fontSize: '20px', paddingLeft: '4px' }}>
                        ▶
                      </div>
                      <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'var(--color-white)', padding: '2px 6px', fontSize: '11px', borderRadius: '2px' }}>
                        {vid.duration}
                      </span>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span className="badge badge-emerald" style={{ width: 'fit-content' }}>{vid.category}</span>
                      <h4 style={{ fontSize: '14.5px', color: 'var(--color-charcoal-deep)', fontWeight: '700', lineHeight: '1.4' }}>{vid.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shorts Channel */}
            <div>
              <h3 style={{ fontSize: '20px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '24px' }}>
                📱 세로형 쇼츠 채널
              </h3>
              <div className="shorts-container-row">
                {SHORTS.map(short => (
                  <div 
                    key={short.id} 
                    className="shorts-card" 
                    onClick={() => alert(`"${short.title}" 쇼츠 영상 팝업 재생 시뮬레이션`)}
                  >
                    <div className="shorts-bg-image" style={{ backgroundImage: `url("${short.img}")` }} />
                    <div className="shorts-play-btn">▶</div>
                    <div className="shorts-overlay-gradient">
                      <h4 style={{ fontSize: '13px', fontWeight: '800', lineHeight: '1.4', marginBottom: '4px' }}>{short.title}</h4>
                      <span style={{ fontSize: '11px', color: '#ccc' }}>👀 {short.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Player Modal */}
            {playingVideo && (
              <div className="write-form-overlay" onClick={() => setPlayingVideo(null)}>
                <div 
                  className="glass-panel animate-fade-in" 
                  style={{ maxWidth: '800px', width: '100%', padding: '0', overflow: 'hidden', background: '#000', border: 'none', position: 'relative' }}
                  onClick={e => e.stopPropagation()}
                >
                  <button 
                    type="button" 
                    style={{ position: 'absolute', right: '16px', top: '16px', fontSize: '24px', color: '#fff', zIndex: 10 }}
                    onClick={() => setPlayingVideo(null)}
                  >
                    ✕
                  </button>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#111' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: '12px' }}>
                      <span style={{ fontSize: '32px' }}>🎬</span>
                      <h3>{playingVideo.title}</h3>
                      <p style={{ fontSize: '13px', color: '#aaa' }}>[샘플 동영상 임베드 영역 - 실제 운영 시 YouTube iframe 연동]</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PRPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading PR...</div>}>
      <PRContentWrap />
    </Suspense>
  );
}

function PRContentWrap() {
  return <PRContent />;
}
