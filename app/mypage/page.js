'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function MyPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('visitor'); // visitor, entrepreneur, admin
  const [userName, setUserName] = useState('');

  // Brand form state
  const [brandId, setBrandId] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [representative, setRepresentative] = useState('');
  const [category, setCategory] = useState('F&B');
  const [imageUrl, setImageUrl] = useState('');
  const [address, setAddress] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [story, setStory] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [snsUrl, setSnsUrl] = useState('');
  const [brandStatus, setBrandStatus] = useState(null); // null, pending, approved, rejected
  
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirection if no login session
        router.push('/login');
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);
      setUserName(currentUser.user_metadata?.name || '가입회원');
      const role = currentUser.user_metadata?.role || 'visitor';
      setUserRole(role);

      // If entrepreneur, fetch their registered brand details
      if (role === 'entrepreneur' || role === 'admin') {
        const { data: brand, error } = await supabase
          .from('archives')
          .select('*')
          .eq('owner_id', currentUser.id)
          .maybeSingle();

        if (brand) {
          setBrandId(brand.id);
          setCompanyName(brand.company_name || '');
          setRepresentative(brand.representative || '');
          setCategory(brand.category || 'F&B');
          setImageUrl(brand.image_url || '');
          setAddress(brand.address || '');
          setShortDesc(brand.short_desc || '');
          setStory(brand.story || '');
          setWebsiteUrl(brand.website_url || '');
          setSnsUrl(brand.sns_url || '');
          setBrandStatus(brand.status);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleRegisterBrand = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setFormLoading(true);

    try {
      const payload = {
        owner_id: user.id,
        company_name: companyName.trim(),
        representative: representative.trim(),
        category,
        image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop',
        address: address.trim(),
        short_desc: shortDesc.trim(),
        story: story.trim(),
        website_url: websiteUrl.trim(),
        sns_url: snsUrl.trim(),
        status: 'pending' // Submitting resets status to pending for admin approval
      };

      let error = null;

      if (brandId) {
        // Update
        const { error: err } = await supabase
          .from('archives')
          .update(payload)
          .eq('id', brandId);
        error = err;
      } else {
        // Insert
        const { error: err } = await supabase
          .from('archives')
          .insert([payload]);
        error = err;
      }

      if (error) {
        // Fallback or explain if database tables aren't created yet in user's Supabase instance
        if (error.code === '42P01') {
          setMsg({
            type: 'success',
            text: '💡 [데모 모드] Supabase 테이블이 구성되지 않았으나, 브랜드 등록 요청이 브라우저 시뮬레이션으로 완료되었습니다! (어드민 승인 페이지에서 확인 가능)'
          });
          setBrandStatus('pending');
          // Mock local storage mock database to support complete demo flow
          const mockItem = { id: brandId || Math.random().toString(), ...payload };
          localStorage.setItem('sejong_mock_brand', JSON.stringify(mockItem));
        } else {
          setMsg({ type: 'error', text: `등록 중 오류 발생: ${error.message}` });
        }
      } else {
        setMsg({ type: 'success', text: '브랜드 정보 등록/수정 요청이 전송되었습니다! 협회 승인 후 노출됩니다.' });
        setBrandStatus('pending');
      }
    } catch (err) {
      setMsg({ type: 'error', text: '서버 에러가 발생했습니다.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="mypage-loading">
        <div className="spinner"></div>
        <p>사용자 세션 데이터를 확인하고 있습니다...</p>
        <style jsx>{`
          .mypage-loading {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 20px;
            background-color: var(--color-sand-light);
            gap: 20px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--color-gray-light);
            border-top-color: var(--color-emerald-deep);
            border-radius: 50%;
            animation: spin 1s infinite linear;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mypage-wrapper container">
      {/* Header Profile summary */}
      <div className="profile-banner glass-panel">
        <div className="profile-avatar">👤</div>
        <div className="profile-details">
          <h2>{userName}님 환영합니다</h2>
          <div className="badge-row">
            <span className="email-lbl">{user?.email}</span>
            <span className="badge badge-emerald">
              {userRole === 'admin'
                ? '👑 협회 최고 관리자'
                : userRole === 'entrepreneur'
                ? '🏪 로컬 창업가 회원'
                : '👥 일반 방문자 회원'}
            </span>
          </div>
        </div>
        <div className="profile-actions">
          {userRole === 'admin' && (
            <button type="button" className="admin-nav-btn" onClick={() => router.push('/admin')}>
              ⚙️ 승인 관리자 페이지
            </button>
          )}
          <button type="button" className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      {/* Main workspace panels */}
      <div className="mypage-content-grid">
        {/* If Visitor, show Bookmarks */}
        {userRole === 'visitor' ? (
          <div className="mypage-panel-full glass-panel">
            <h3 className="panel-title">🔖 나의 북마크 목록</h3>
            <div className="empty-bookmarks">
              <span className="star-icon">⭐️</span>
              <h4>저장된 아카이브가 없습니다.</h4>
              <p>마음에 드는 창업가 카드의 북마크를 눌러 저장해 보세요.</p>
            </div>
          </div>
        ) : (
          /* If Entrepreneur, show Brand Registration Form */
          <div className="mypage-panel-full glass-panel">
            <div className="panel-header-row">
              <h3 className="panel-title">🏪 나의 로컬 브랜드 아카이빙 관리</h3>
              {brandStatus && (
                <div className={`status-badge ${brandStatus}`}>
                  상태: {brandStatus === 'approved' ? '✅ 승인완료' : brandStatus === 'rejected' ? '❌ 반려됨' : '🕒 대기중'}
                </div>
              )}
            </div>

            {msg.text && (
              <div className={`alert-box ${msg.type}`}>
                {msg.text}
              </div>
            )}

            <form className="brand-reg-form" onSubmit={handleRegisterBrand}>
              <div className="form-row">
                <div className="form-group">
                  <label>기업/브랜드명 *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="예: 디저트 카페 도원"
                  />
                </div>
                <div className="form-group">
                  <label>대표자명 *</label>
                  <input
                    type="text"
                    required
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    placeholder="예: 이민수"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>업종 카테고리 *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="F&B">F&B (식음료)</option>
                    <option value="Craft">로컬제조 (공예/디자인)</option>
                    <option value="Culture">문화/예술/체험</option>
                    <option value="Space">공유공간/대관</option>
                    <option value="Tech">IT / 스마트 테크</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>대표 이미지 URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label>소재지 주소 (상세 주소 포함) *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="예: 세종특별자치시 조치원읍 으뜸길 12"
                />
              </div>

              <div className="form-group">
                <label>한 줄 브랜드 소개 (검색 노출용) *</label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="예: 조치원 특산 복숭아잼을 만드는 아기자기한 디저트 카페"
                />
              </div>

              <div className="form-group">
                <label>상세 브랜드 스토리 (Markdown 작성 지원) *</label>
                <textarea
                  required
                  rows={8}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="## 브랜드 탄생 스토리&#10;&#10;창업하게 된 배경과 제품의 장점을 설명해 주세요."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>공식 웹사이트 URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label>공식 SNS URL (인스타그램 등)</label>
                  <input
                    type="url"
                    value={snsUrl}
                    onChange={(e) => setSnsUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <button type="submit" disabled={formLoading} className="form-submit-btn">
                {formLoading ? '저장 처리 중...' : brandId ? '브랜드 정보 업데이트 신청' : '신규 브랜드 아카이빙 등록 신청'}
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .mypage-wrapper {
          padding-top: 40px;
          padding-bottom: 100px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .profile-banner {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .profile-banner {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .profile-avatar {
          font-size: 48px;
          width: 80px;
          height: 80px;
          background-color: var(--color-sand-medium);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .profile-details h2 {
          font-size: 22px;
          color: var(--color-charcoal-deep);
        }

        .badge-row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .email-lbl {
          font-size: 14px;
          color: var(--color-gray-dark);
        }

        .profile-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .logout-btn {
          border: 1px solid var(--color-orange-accent);
          color: var(--color-orange-accent);
          padding: 10px 20px;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
        }

        .logout-btn:hover {
          background-color: var(--color-orange-light);
        }

        .admin-nav-btn {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          padding: 10px 20px;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
        }

        .admin-nav-btn:hover {
          background-color: var(--color-emerald-medium);
        }

        .mypage-content-grid {
          width: 100%;
        }

        .mypage-panel-full {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          padding: 30px;
        }

        .panel-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid var(--color-emerald-deep);
          padding-bottom: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .panel-title {
          font-size: 18px;
          font-weight: 800;
        }

        .status-badge {
          font-size: 13px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: var(--border-radius-sm);
        }

        .status-badge.pending {
          background-color: var(--color-sand-medium);
          color: var(--color-charcoal-deep);
        }

        .status-badge.approved {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
        }

        .status-badge.rejected {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
        }

        .empty-bookmarks {
          padding: 80px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .star-icon {
          font-size: 40px;
        }

        .empty-bookmarks h4 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-charcoal-deep);
        }

        .empty-bookmarks p {
          font-size: 14px;
          color: var(--color-gray-dark);
        }

        .brand-reg-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          padding: 12px;
          outline: none;
          font-size: 14px;
          font-weight: 600;
          background-color: var(--color-sand-light);
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--color-emerald-deep);
          background-color: var(--color-white);
        }

        .form-submit-btn {
          height: 52px;
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          font-size: 15px;
          font-weight: 700;
          border-radius: var(--border-radius-sm);
          transition: background-color 0.2s ease;
          margin-top: 10px;
        }

        .form-submit-btn:hover {
          background-color: var(--color-emerald-medium);
        }

        .form-submit-btn:disabled {
          background-color: var(--color-gray-medium);
          cursor: not-allowed;
        }

        .alert-box {
          padding: 16px;
          border-radius: var(--border-radius-sm);
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .alert-box.success {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
          border: 1px solid var(--color-emerald-light);
        }

        .alert-box.error {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
          border: 1px solid var(--color-orange-accent);
        }
      `}</style>
    </div>
  );
}
