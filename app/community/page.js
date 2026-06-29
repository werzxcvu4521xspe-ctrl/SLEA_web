'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const INITIAL_POSTS = [
  { id: 1, category: 'collab', title: '복숭아 가공 디저트 관련 패키지 박스 공동 제작할 브랜드 구합니다.', author: '이민수', date: '2026-06-29', views: 42, content: '카페 도원입니다. 복숭아 수제 병조림 및 구움과자용 친환경 크라프트 패키지 박스를 소량 제작하려니 단가가 맞지 않네요. 혹시 포장 박스 공동 인쇄 및 공동 발주하실 로컬 F&B 대표님 계신가요?' },
  { id: 2, category: 'info', title: '조치원 원도심 공실 상가 무상 임대 및 청년창업 3기 모집 공고 공유', author: '최준혁', date: '2026-06-28', views: 89, content: '세종시 재생지원센터에서 원도심 청년거리 활성화를 위해 공실 상가를 1년간 무상 대관하고 인테리어비를 일부 보조해 주는 3기 창업가 모집을 시작했습니다. 7월 15일 마감이니 참고하세요!' },
  { id: 3, category: 'support', title: '[지원사업] 2026 세종 로컬 크리에이터 활성화 자금 최대 3천만원 지원 공고', author: '정우진', date: '2026-06-25', views: 121, content: '소상공인시장진흥공단에서 주관하는 권역별 로컬 크리에이터 활성화 지원금 공고가 떴습니다. 사업계획서 양식은 창업지원센터 자료실에 업로드해 두었으니 회원분들은 참고하시어 기한 내 신청 바랍니다.' },
  { id: 4, category: 'jobs', title: '조치원 브루어리 주말 매장 파트타이머 및 바리스타 급구합니다', author: '김유리', date: '2026-06-22', views: 65, content: '브루어리 펍 주말 근무하실 파트타이머 1명을 모집합니다. 로컬 식음료와 청년 기획 행사에 열정이 가득하신 세종 거주 청년분들의 많은 지원 부탁드립니다. 시급 11,000원입니다.' },
  { id: 5, category: 'trade', title: '[중고거래] 카페용 업소용 우유 스팀 피처 & 바리스타 저울 일괄 처분합니다', author: '황정민', date: '2026-06-19', views: 31, content: '카페 기기 리뉴얼로 인해 사용감이 적은 아카이아 바리스타 전자저울 및 스팀 피처 3종을 일괄 10만원에 양도합니다. 아름동 밀마루 베이커리 매장에서 직거래 희망합니다.' }
];

function CommunityContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(tabParam);

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Write modal state
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [writeCategory, setWriteCategory] = useState('collab');
  const [writeTitle, setWriteTitle] = useState('');
  const [writeAuthor, setWriteAuthor] = useState('');
  const [writeContent, setWriteContent] = useState('');

  // Read post state
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    setSelectedCategory(tabParam);
  }, [tabParam]);

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    router.push(`/community?category=${catName}`, { scroll: false });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!writeTitle || !writeAuthor || !writeContent) return;

    const newPost = {
      id: posts.length + 1,
      category: writeCategory,
      title: writeTitle,
      author: writeAuthor,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      content: writeContent
    };

    setPosts([newPost, ...posts]);
    setIsWriteOpen(false);
    
    // Clear inputs
    setWriteTitle('');
    setWriteAuthor('');
    setWriteContent('');
    alert('새 글이 성공적으로 등록되었습니다.');
  };

  // Filtered posts
  const filteredPosts = posts.filter(post => {
    // Search
    const matchesSearch = searchQuery.trim() === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Category
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categoryNames = {
    collab: '🤝 협업 제안',
    info: '💡 사업 정보',
    support: '🏛️ 지원사업',
    jobs: '💼 구인구직',
    trade: '🔄 중고거래'
  };

  return (
    <div className="community-page-wrapper">
      {/* Banner */}
      <section className="page-hero-banner">
        <div className="container">
          <span className="section-label en-title" style={{ color: 'var(--color-orange-accent)' }}>Free Board</span>
          <h1 className="page-hero-title">자유게시판</h1>
          <p className="page-hero-desc">
            세종시 로컬 창업가와 기획자들이 나누는 소통의 공간. <br />
            협업 파트너를 구하고, 알찬 사업 정보와 구인 소식, 물품 거래를 함께하세요.
          </p>
        </div>
      </section>

      {/* Tabs / Filter Navigation */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="nav-tab-bar">
          {[
            { code: 'all', name: '전체글' },
            { code: 'collab', name: '협업 제안' },
            { code: 'info', name: '사업 정보' },
            { code: 'support', name: '지원사업' },
            { code: 'jobs', name: '구인구직' },
            { code: 'trade', name: '중고거래' }
          ].map(tab => (
            <button
              key={tab.code}
              type="button"
              className={`tab-btn ${selectedCategory === tab.code ? 'active' : ''}`}
              onClick={() => handleCategoryChange(tab.code)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Search and Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              placeholder="게시판 글 제목, 본문, 작성자 검색..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', border: '1px solid var(--color-gray-light)', padding: '10px 12px 10px 32px', borderRadius: '4px', background: 'var(--color-sand-light)', fontSize: '14px' }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '12px' }}>🔍</span>
          </div>

          <button 
            type="button" 
            className="subscribe-btn"
            style={{ height: '42px', padding: '0 24px', fontSize: '14px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setIsWriteOpen(true)}
          >
            ✏️ 글쓰기
          </button>
        </div>

        {/* Board List Table */}
        <div className="glass-panel" style={{ backgroundColor: 'var(--color-white)', overflowX: 'auto', padding: '10px' }}>
          <table className="community-list-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>분류</th>
                <th>제목</th>
                <th style={{ width: '100px' }}>작성자</th>
                <th style={{ width: '120px' }}>등록일</th>
                <th style={{ width: '80px', textAlign: 'center' }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id} className="post-row" onClick={() => setSelectedPost(post)}>
                  <td>
                    <span className="badge badge-emerald">
                      {categoryNames[post.category]}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--color-charcoal-deep)' }}>
                    {post.title}
                  </td>
                  <td style={{ color: 'var(--color-gray-dark)', fontWeight: '600' }}>{post.author}</td>
                  <td style={{ color: 'var(--color-gray-medium)' }}>{post.date}</td>
                  <td style={{ textAlign: 'center', color: 'var(--color-gray-medium)' }}>{post.views}</td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-gray-dark)', fontWeight: '700' }}>
                    등록된 게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Write Post Modal */}
      {isWriteOpen && (
        <div className="write-form-overlay" onClick={() => setIsWriteOpen(false)}>
          <div 
            className="glass-panel animate-fade-in" 
            style={{ maxWidth: '600px', width: '100%', padding: '40px', backgroundColor: 'var(--color-white)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              type="button" 
              style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '20px', fontWeight: 'bold' }}
              onClick={() => setIsWriteOpen(false)}
            >
              ✕
            </button>
            <h2 style={{ fontSize: '22px', color: 'var(--color-charcoal-deep)', marginBottom: '20px' }}>✏️ 커뮤니티 글쓰기</h2>
            
            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>게시판 카테고리</label>
                <select 
                  value={writeCategory} 
                  onChange={(e) => setWriteCategory(e.target.value)}
                  style={{ border: '1px solid var(--color-gray-light)', padding: '10px', borderRadius: '4px', background: 'var(--color-sand-light)', fontWeight: '600' }}
                >
                  <option value="collab">🤝 협업 제안</option>
                  <option value="info">💡 사업 정보</option>
                  <option value="support">🏛️ 지원사업</option>
                  <option value="jobs">💼 구인구직</option>
                  <option value="trade">🔄 중고거래</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="post-title">글 제목</label>
                <input 
                  id="post-title"
                  type="text" 
                  required 
                  placeholder="제목을 입력하세요" 
                  value={writeTitle}
                  onChange={(e) => setWriteTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-author">작성자명</label>
                <input 
                  id="post-author"
                  type="text" 
                  required 
                  placeholder="성함 또는 브랜드명" 
                  value={writeAuthor}
                  onChange={(e) => setWriteAuthor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-content">본문 내용</label>
                <textarea 
                  id="post-content"
                  required 
                  rows="6" 
                  placeholder="본문 내용을 입력하세요" 
                  value={writeContent}
                  onChange={(e) => setWriteContent(e.target.value)}
                  style={{ border: '1px solid var(--color-gray-light)', padding: '12px', borderRadius: '4px', background: 'var(--color-sand-light)', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px' }}
                />
              </div>

              <button type="submit" className="subscribe-btn" style={{ marginTop: '10px' }}>
                게시물 등록하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Read Post Modal */}
      {selectedPost && (
        <div className="write-form-overlay" onClick={() => setSelectedPost(null)}>
          <div 
            className="glass-panel animate-fade-in" 
            style={{ maxWidth: '600px', width: '100%', padding: '40px', backgroundColor: 'var(--color-white)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              type="button" 
              style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '20px', fontWeight: 'bold' }}
              onClick={() => setSelectedPost(null)}
            >
              ✕
            </button>
            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
              {categoryNames[selectedPost.category]}
            </span>
            <h2 style={{ fontSize: '20px', color: 'var(--color-charcoal-deep)', marginBottom: '8px', lineHeight: '1.3' }}>
              {selectedPost.title}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '12px', marginBottom: '20px', fontSize: '13px', color: 'var(--color-gray-medium)' }}>
              <span>작성자: <strong>{selectedPost.author}</strong></span>
              <span>등록일: {selectedPost.date} | 조회수: {selectedPost.views}</span>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
              <p style={{ fontSize: '14.5px', lineHeight: '1.8', color: 'var(--color-gray-dark)', whiteSpace: 'pre-line', textAlign: 'justify' }}>
                {selectedPost.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading Community...</div>}>
      <CommunityContentWrap />
    </Suspense>
  );
}

function CommunityContentWrap() {
  return <CommunityContent />;
}
