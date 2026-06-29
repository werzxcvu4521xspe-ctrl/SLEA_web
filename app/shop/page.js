'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PRODUCTS = [
  { id: 1, category: 'food', name: '조치원 복숭아 수제 병조림 세트', price: '24,000원', brand: '디저트 카페 도원', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop' },
  { id: 2, category: 'craft', name: '세종 세라믹 핸드메이드 머그컵', price: '18,500원', brand: '공방 세종', img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=300&auto=format&fit=crop' },
  { id: 3, category: 'goods', name: '한글도시 세종 친환경 린넨 에코백', price: '12,000원', brand: '세종 굿즈 팩토리', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop' },
  { id: 4, category: 'beauty', name: '세종 조치원 국화꽃 에센셜 보디 오일', price: '32,000원', brand: '뷰티 로컬 랩', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=300&auto=format&fit=crop' },
  { id: 5, category: 'pet', name: '유기농 쌀비지 애견 수제 간식 쿠키', price: '8,900원', brand: '밀마루 베이커리', img: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=300&auto=format&fit=crop' },
  { id: 6, category: 'fashion', name: '세종 전통 한지 혼방 워셔블 셔츠', price: '59,000원', brand: '아뜰리에 세종', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=300&auto=format&fit=crop' }
];

const GROUP_BUYS = [
  { id: 1, name: '조치원 복숭아 사이더 (스파클링 와인) 6병입', normalPrice: '72,000원', discountPrice: '43,200원', progress: 78, current: 78, target: 100, daysLeft: 4, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=300&auto=format&fit=crop' },
  { id: 2, name: '백년 양조장 전통 탁주 무감미료 세트 (4병입)', normalPrice: '38,000원', discountPrice: '26,600원', progress: 92, current: 46, target: 50, daysLeft: 2, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=300&auto=format&fit=crop' }
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'brand';
  const [activeTab, setActiveTab] = useState(tabParam);

  // Brand Shop Category State
  const [subCategory, setSubCategory] = useState('all');

  // Partner proposal
  const [partnerName, setPartnerName] = useState('');
  const [partnerProduct, setPartnerProduct] = useState('');
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.push(`/shop?tab=${tabName}`, { scroll: false });
  };

  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    if (!partnerName || !partnerProduct) return;
    setPartnerSubmitted(true);
    setTimeout(() => {
      setPartnerSubmitted(false);
      setPartnerName('');
      setPartnerProduct('');
      alert('입점 및 제휴 상담 문의가 성공적으로 접수되었습니다. 3일 내에 회신해 드립니다.');
    }, 1000);
  };

  // Filtered Products
  const filteredProducts = subCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === subCategory);

  return (
    <div className="shop-page-wrapper">
      {/* Banner */}
      <section className="page-hero-banner">
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>Local Brand Mall</span>
          <h1 className="page-hero-title">로컬브랜드 쇼핑몰</h1>
          <p className="page-hero-desc">
            세종의 정취와 가치를 가득 품은 협회 정회원 브랜드 상품전. <br />
            트렌디한 로컬 푸드, 고품격 수공예품, 매력적인 라이프스타일 굿즈를 소개합니다.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="nav-tab-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'brand' ? 'active' : ''}`}
            onClick={() => handleTabChange('brand')}
          >
            브랜드관 (카테고리별)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => handleTabChange('group')}
          >
            공동구매 & 추천상품
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'partner' ? 'active' : ''}`}
            onClick={() => handleTabChange('partner')}
          >
            회원 브랜드 입점 안내
          </button>
        </div>

        {/* Tab 1: Brand Directory Mall */}
        {activeTab === 'brand' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Subcategories */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'all', name: '전체 상품' },
                { id: 'food', name: '식품 (F&B)' },
                { id: 'craft', name: '공예 (Craft)' },
                { id: 'goods', name: '굿즈 (Goods)' },
                { id: 'beauty', name: '뷰티 (Beauty)' },
                { id: 'pet', name: '반려동물 (Pet)' },
                { id: 'fashion', name: '패션 (Fashion)' }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSubCategory(sub.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--border-radius-full)',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: '1px solid var(--color-gray-light)',
                    background: subCategory === sub.id ? 'var(--color-emerald-deep)' : 'var(--color-white)',
                    color: subCategory === sub.id ? 'var(--color-white)' : 'var(--color-gray-dark)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <div className="grid-3">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="glass-panel" 
                  style={{ 
                    backgroundColor: 'var(--color-white)', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ height: '220px', backgroundImage: `url("${product.img}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-emerald-medium)', fontWeight: '800' }}>{product.brand}</span>
                    <h4 style={{ fontSize: '15.5px', color: 'var(--color-charcoal-deep)', lineHeight: '1.4', flexGrow: 1 }}>{product.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--color-charcoal-deep)' }}>{product.price}</span>
                      <button 
                        type="button" 
                        className="subscribe-btn"
                        style={{ height: '36px', fontSize: '12px', padding: '0 16px', borderRadius: '4px' }}
                        onClick={() => alert(`"${product.name}" 상품 구매 페이지(스마트스토어 등)로 이동합니다.`)}
                      >
                        구매하기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Group Buying & Recommendation */}
        {activeTab === 'group' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {/* Group Buys */}
            <div>
              <h3 style={{ fontSize: '20px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '24px' }}>
                🔥 진행 중인 공동구매 딜
              </h3>
              <div className="grid-2">
                {GROUP_BUYS.map(gb => (
                  <div key={gb.id} className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '24px', backgroundColor: 'var(--color-white)', flexWrap: 'wrap' }}>
                    <div style={{ width: '120px', height: '120px', backgroundImage: `url("${gb.img}")`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px' }} />
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span className="badge badge-apply" style={{ width: 'fit-content' }}>⏰ 마감 {gb.daysLeft}일 전</span>
                      <h4 style={{ fontSize: '16px', color: 'var(--color-charcoal-deep)' }}>{gb.name}</h4>
                      
                      {/* Price info */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginTop: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#888', textDecoration: 'line-through' }}>{gb.normalPrice}</span>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-orange-accent)' }}>{gb.discountPrice}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${gb.progress}%` }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: 'var(--color-gray-dark)' }}>
                        <span>달성률 {gb.progress}%</span>
                        <span>{gb.current} / {gb.target} 세트</span>
                      </div>

                      <button 
                        type="button" 
                        className="subscribe-btn"
                        style={{ width: '100%', height: '36px', fontSize: '13px', borderRadius: '4px', marginTop: '12px' }}
                        onClick={() => alert(`"${gb.name}" 공동구매 펀딩 참여 페이지로 연결됩니다.`)}
                      >
                        공동구매 참여하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Products */}
            <div>
              <h3 style={{ fontSize: '20px', borderBottom: '2px solid var(--color-emerald-deep)', paddingBottom: '8px', marginBottom: '24px' }}>
                🌟 협회 추천 명품 셀렉션
              </h3>
              <div className="grid-3">
                {PRODUCTS.slice(0, 3).map(prod => (
                  <div key={prod.id} className="glass-panel" style={{ backgroundColor: 'var(--color-white)', overflow: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ height: '180px', backgroundImage: `url("${prod.img}")`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px' }} />
                    <span className="badge badge-emerald" style={{ width: 'fit-content' }}>MD 추천</span>
                    <h4 style={{ fontSize: '15px', color: 'var(--color-charcoal-deep)' }}>{prod.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800' }}>{prod.price}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-gray-medium)', fontWeight: '700' }}>{prod.brand}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Vendor Partner Register */}
        {activeTab === 'partner' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="grid-2">
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-emerald-deep)', marginBottom: '16px' }}>쇼핑몰 입점 안내</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--color-gray-dark)', lineHeight: '1.7', marginBottom: '20px' }}>
                  세종로컬창업가협회 정회원 브랜드라면 누구나 입점 수수료 0% 혜택으로 자사 상품을 협회 플랫폼 쇼핑몰에 등록하고 
                  홍보할 수 있습니다.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px', background: 'var(--color-sand-light)', borderRadius: '4px' }}>
                    <strong>입점 절차:</strong> 입점 제안서 전송 ➔ 1차 상품성 검토 ➔ 상세페이지 및 링크 등록 ➔ 공동구매 기획전 조율
                  </div>
                  <div style={{ padding: '12px', background: 'var(--color-sand-light)', borderRadius: '4px' }}>
                    <strong>입점 자격:</strong> 세종로컬창업가협회 정회원 가입 완료 브랜드
                  </div>
                </div>
              </div>

              {/* Proposal Form */}
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '16px' }}>🏬 입점 및 판매 제휴 제안</h3>
                <form className="newsletter-form" onSubmit={handlePartnerSubmit}>
                  <div className="form-group">
                    <label htmlFor="shop-brand">브랜드 및 업체명</label>
                    <input 
                      id="shop-brand"
                      type="text" 
                      required 
                      placeholder="예) 디저트 카페 도원" 
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="shop-prod">입점 희망 상품군 및 소개</label>
                    <textarea 
                      id="shop-prod"
                      required 
                      rows="4" 
                      placeholder="제품 성격, 예상 가격대, 자사몰 링크 등을 간략히 적어주세요." 
                      value={partnerProduct}
                      onChange={(e) => setPartnerProduct(e.target.value)}
                      style={{ border: '1px solid var(--color-gray-light)', padding: '12px', borderRadius: '4px', background: 'var(--color-sand-light)', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px' }}
                    />
                  </div>
                  <button type="submit" className="subscribe-btn" style={{ marginTop: '10px' }}>
                    입점 상담 문의하기
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading Shop...</div>}>
      <ShopContentWrap />
    </Suspense>
  );
}

function ShopContentWrap() {
  return <ShopContent />;
}
