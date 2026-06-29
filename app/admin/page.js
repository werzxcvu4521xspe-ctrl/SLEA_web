'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'super_admin', 'staff_admin', 'user', null
  const [activeSubTab, setActiveSubTab] = useState('home'); // 'home', 'approval', 'category', 'system'
  
  // Pending registrations simulation state
  const [pendingRegistrations, setPendingRegistrations] = useState([
    { id: 'reg-1', name: '홍길동', brand: '활빈 로컬 푸드', category: 'F&B', phone: '010-1111-2222', date: '2026-06-29', feePaid: true },
    { id: 'reg-2', name: '성춘향', brand: '광한루 전통 굿즈', category: 'Goods', phone: '010-3333-4444', date: '2026-06-28', feePaid: false },
    { id: 'reg-3', name: '이몽룡', brand: '어사 출두 공방', category: 'Craft', phone: '010-5555-6666', date: '2026-06-27', feePaid: true },
  ]);

  // Categories list simulation state
  const [categories, setCategories] = useState([
    { code: 'food', name: '식품 (F&B)', count: 12 },
    { code: 'craft', name: '공예 (Craft)', count: 7 },
    { code: 'goods', name: '굿즈 (Goods)', count: 9 },
    { code: 'beauty', name: '뷰티 (Beauty)', count: 4 },
    { code: 'pet', name: '반려동물 (Pet)', count: 3 },
    { code: 'fashion', name: '패션 (Fashion)', count: 6 },
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');

  const [msg, setMsg] = useState({ type: '', text: '' });

  // Check role & override status
  const checkRole = async () => {
    setLoading(true);
    
    // Check override first
    const override = localStorage.getItem('sejong_role_override');
    if (override) {
      if (override === 'none') {
        router.push('/login');
        return;
      }
      if (override === 'user') {
        alert('관리자 권한이 없습니다. 일반 계정은 마이페이지로 이동합니다.');
        router.push('/mypage');
        return;
      }
      setUserRole(override);
      setLoading(false);
      return;
    }

    // Fallback: Real session check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const role = session.user.user_metadata?.role;
    if (role !== 'super_admin' && role !== 'staff_admin') {
      alert('관리자 권한이 없습니다. 일반 계정은 마이페이지로 이동합니다.');
      router.push('/mypage');
      return;
    }

    setUserRole(role);
    setLoading(false);
  };

  useEffect(() => {
    checkRole();
    window.addEventListener('storage', checkRole);
    window.addEventListener('sejong_role_update', checkRole);
    return () => {
      window.removeEventListener('storage', checkRole);
      window.removeEventListener('sejong_role_update', checkRole);
    };
  }, [router]);

  // Simulate Role Switching
  const handleSimulateRole = (role) => {
    localStorage.setItem('sejong_role_override', role);
    window.dispatchEvent(new Event('sejong_role_update'));
    setMsg({ type: 'success', text: `시뮬레이터: 권한이 [${role === 'super_admin' ? '최고 관리자 (Level 2)' : role === 'staff_admin' ? '일반 관리자 (Level 1)' : role === 'user' ? '일반 회원' : '비로그인'}] 상태로 전환되었습니다.` });
    
    if (role === 'user' || role === 'none') {
      checkRole();
    } else {
      setUserRole(role);
    }
  };

  // Actions
  const handleApprove = (id, name) => {
    if (userRole !== 'super_admin') {
      setMsg({ type: 'error', text: '🔒 권한 부족: 회원 승인/반려 작업은 최고 관리자(Level 2)만 실행할 수 있습니다.' });
      return;
    }
    setPendingRegistrations(prev => prev.filter(item => item.id !== id));
    setMsg({ type: 'success', text: `성공: [${name}] 대표님의 정회원 가입 신청이 최종 승인 처리되었습니다.` });
  };

  const handleReject = (id, name) => {
    if (userRole !== 'super_admin') {
      setMsg({ type: 'error', text: '🔒 권한 부족: 회원 승인/반려 작업은 최고 관리자(Level 2)만 실행할 수 있습니다.' });
      return;
    }
    setPendingRegistrations(prev => prev.filter(item => item.id !== id));
    setMsg({ type: 'success', text: `반려: [${name}] 대표님의 정회원 가입 신청서가 반려 처리되었습니다.` });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName || !newCatCode) return;
    setCategories(prev => [...prev, { code: newCatCode.trim().toLowerCase(), name: newCatName.trim(), count: 0 }]);
    setNewCatName('');
    setNewCatCode('');
    setMsg({ type: 'success', text: `카테고리 [${newCatName}] 가 신규 추가되었습니다.` });
  };

  const handleDeleteCategory = (code, name) => {
    setCategories(prev => prev.filter(cat => cat.code !== code));
    setMsg({ type: 'success', text: `카테고리 [${name}] 가 삭제되었습니다.` });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '150px 0', textAlign: 'center', minHeight: '80vh' }}>
        <p style={{ fontWeight: '700', color: 'var(--color-emerald-deep)' }}>보안 관리자 대시보드를 불러오고 있습니다...</p>
      </div>
    );
  }

  const isSuperAdmin = userRole === 'super_admin';

  return (
    <div className="admin-outer-container">
      {/* Sidebar Section */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">👑</span>
          <div>
            <h3 className="brand-title">협회 통합 관리툴</h3>
            <span className="brand-subtitle">Sejong Local Admin</span>
          </div>
        </div>

        {/* Current Role Badge */}
        <div className="role-badge-box">
          <span style={{ fontSize: '11px', color: 'var(--color-gray-dark)', fontWeight: '700', textTransform: 'uppercase' }}>보안 레벨</span>
          {isSuperAdmin ? (
            <div className="role-badge super">최고 관리자 (Level 2)</div>
          ) : (
            <div className="role-badge staff">일반 관리자 (Level 1)</div>
          )}
        </div>

        {/* Navigation Menus */}
        <nav className="sidebar-nav">
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'home' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('home'); setMsg({type:'',text:''}); }}
          >
            🏠 대시보드 홈
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'approval' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('approval'); setMsg({type:'',text:''}); }}
          >
            📋 회원 가입 승인 {pendingRegistrations.length > 0 && <span className="indicator-dot">{pendingRegistrations.length}</span>}
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'category' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('category'); setMsg({type:'',text:''}); }}
          >
            📁 카테고리 및 컨텐츠 설정
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'system' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('system'); setMsg({type:'',text:''}); }}
          >
            ⚙️ 시스템 설정 {!isSuperAdmin && '🔒'}
          </button>
        </nav>

        {/* Simulator Panel (For Demonstration) */}
        <div className="simulator-panel">
          <h4 className="sim-title">⚙️ 권한 시뮬레이터</h4>
          <p className="sim-desc">클릭하여 관리자 등급별 보기 권한 및 차단 UI를 테스트해 보세요.</p>
          <div className="sim-buttons">
            <button 
              type="button" 
              className={`sim-btn ${userRole === 'super_admin' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('super_admin')}
            >
              최고 관리자 (Lv.2)
            </button>
            <button 
              type="button" 
              className={`sim-btn ${userRole === 'staff_admin' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('staff_admin')}
            >
              일반 관리자 (Lv.1)
            </button>
            <button 
              type="button" 
              className="sim-btn reset"
              onClick={() => handleSimulateRole('user')}
            >
              일반회원으로 강등
            </button>
            <button 
              type="button" 
              className="sim-btn reset"
              onClick={() => handleSimulateRole('none')}
            >
              로그아웃 (권한 해제)
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header className="content-header">
          <div>
            <span className="breadcrumb">Admin &gt; {activeSubTab}</span>
            <h1 className="header-title">
              {activeSubTab === 'home' && '대시보드 개요'}
              {activeSubTab === 'approval' && '정회원 가입 신청 승인'}
              {activeSubTab === 'category' && '쇼핑몰 카테고리 관리'}
              {activeSubTab === 'system' && '시스템 인프라 및 권한 설정'}
            </h1>
          </div>
          <Link href="/" className="exit-btn">
            GNB 홈페이지 바로가기 ➔
          </Link>
        </header>

        {msg.text && (
          <div className={`alert-box ${msg.type}`} style={{ marginBottom: '24px' }}>
            {msg.type === 'error' ? '❌ ' : '✨ '} {msg.text}
          </div>
        )}

        {/* Tab 1: Dashboard Home */}
        {activeSubTab === 'home' && (
          <div className="tab-view animate-fade-in">
            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">총 등록 회원수</span>
                <span className="stat-val">128 명</span>
                <span className="stat-sub">전월 대비 +12% 증가</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">가입 승인 대기</span>
                <span className="stat-val" style={{ color: 'var(--color-orange-accent)' }}>{pendingRegistrations.length} 건</span>
                <span className="stat-sub">오늘 접수된 건: 2건</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">활성 브랜드 쇼핑몰 수</span>
                <span className="stat-val">42 개</span>
                <span className="stat-sub">식품(F&B) 및 굿즈 강세</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">이번 달 정기 네트워킹</span>
                <span className="stat-val" style={{ color: 'var(--color-emerald-deep)' }}>1회 (완료)</span>
                <span className="stat-sub">세로데이 만족도 평균 9.8</span>
              </div>
            </div>

            {/* Quick overview grids */}
            <div className="overview-split" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '10px' }}>
                  📌 최근 정회원 신청 요약
                </h3>
                {pendingRegistrations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pendingRegistrations.map(reg => (
                      <div key={reg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--color-sand-light)', borderRadius: '4px' }}>
                        <div>
                          <strong style={{ fontSize: '14.5px', color: 'var(--color-charcoal-deep)' }}>{reg.brand}</strong>
                          <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>대표: {reg.name} ({reg.category})</span>
                        </div>
                        <span style={{ fontSize: '12px', color: reg.feePaid ? 'var(--color-emerald-deep)' : 'var(--color-orange-accent)', fontWeight: '800' }}>
                          {reg.feePaid ? '회비 입금완료' : '입금 대기'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', fontSize: '13.5px' }}>승인 처리 대기 중인 회원이 없습니다.</p>
                )}
              </div>

              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '10px' }}>
                  ⚡ 시스템 로그 요약
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'var(--color-gray-dark)' }}>
                  <div>• [04:12] Supabase DB 연결 활성화 완료</div>
                  <div>• [04:10] 시뮬레이션 토글: {userRole}</div>
                  <div>• [03:55] Vercel 프로덕션 자동 배포 트리거</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Member Approvals */}
        {activeSubTab === 'approval' && (
          <div className="tab-view animate-fade-in glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', margin: '0' }}>
                🕒 승인 심사 대기자 목록 ({pendingRegistrations.length})
              </h3>
              {!isSuperAdmin && (
                <span style={{ color: 'var(--color-orange-accent)', fontSize: '13px', fontWeight: '700' }}>
                  🔒 Level 1 일반관리자는 승인 처리가 불가합니다 (읽기 전용).
                </span>
              )}
            </div>

            {pendingRegistrations.length > 0 ? (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>신청자명</th>
                      <th>브랜드(업체)명</th>
                      <th>업종 카테고리</th>
                      <th>연락처</th>
                      <th>신청일</th>
                      <th>회비납부여부</th>
                      <th style={{ textAlign: 'center' }}>조치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRegistrations.map((reg) => (
                      <tr key={reg.id}>
                        <td style={{ fontWeight: '700' }}>{reg.name}</td>
                        <td>{reg.brand}</td>
                        <td><span className="badge badge-emerald" style={{ fontSize: '11px' }}>{reg.category}</span></td>
                        <td>{reg.phone}</td>
                        <td>{reg.date}</td>
                        <td>
                          <span style={{ 
                            fontSize: '12px', 
                            fontWeight: '800', 
                            color: reg.feePaid ? 'var(--color-emerald-deep)' : 'var(--color-orange-accent)',
                            background: reg.feePaid ? 'var(--color-emerald-pale)' : 'var(--color-orange-light)',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {reg.feePaid ? '납부 확인됨' : '미납 (확인중)'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              className={`action-btn approve ${!isSuperAdmin ? 'disabled' : ''}`}
                              disabled={!isSuperAdmin}
                              onClick={() => handleApprove(reg.id, reg.name)}
                            >
                              {!isSuperAdmin && '🔒 '}승인
                            </button>
                            <button
                              type="button"
                              className={`action-btn reject ${!isSuperAdmin ? 'disabled' : ''}`}
                              disabled={!isSuperAdmin}
                              onClick={() => handleReject(reg.id, reg.name)}
                            >
                              {!isSuperAdmin && '🔒 '}반려
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                <span style={{ fontSize: '40px' }}>🎉</span>
                <p style={{ marginTop: '12px', fontWeight: '700' }}>모든 정회원 신청 승인 심사가 완료되었습니다!</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Category Management */}
        {activeSubTab === 'category' && (
          <div className="tab-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="grid-2">
              {/* Category creation form */}
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '20px' }}>
                  ➕ 카테고리 추가
                </h3>
                <form className="newsletter-form" onSubmit={handleAddCategory}>
                  <div className="form-group">
                    <label htmlFor="cat-code">카테고리 코드 (영어 소문자)</label>
                    <input 
                      id="cat-code"
                      type="text" 
                      required 
                      placeholder="예) fashion, beauty" 
                      value={newCatCode} 
                      onChange={(e) => setNewCatCode(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cat-name">카테고리 한글명</label>
                    <input 
                      id="cat-name"
                      type="text" 
                      required 
                      placeholder="예) 패션 (Fashion)" 
                      value={newCatName} 
                      onChange={(e) => setNewCatName(e.target.value)} 
                    />
                  </div>
                  <button type="submit" className="subscribe-btn" style={{ height: '46px', marginTop: '10px' }}>
                    카테고리 생성 등록 ➔
                  </button>
                </form>
              </div>

              {/* Current Categories List */}
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '20px' }}>
                  📁 활성 브랜드 카테고리 목록 ({categories.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categories.map((cat) => (
                    <div 
                      key={cat.code} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        background: 'var(--color-sand-light)', 
                        borderRadius: '4px',
                        borderLeft: '4px solid var(--color-emerald-deep)'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '15px' }}>{cat.name}</strong>
                        <span style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>({cat.code})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-emerald-medium)' }}>
                          {cat.count}개 브랜드
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.code, cat.name)}
                          style={{
                            background: 'none',
                            color: 'var(--color-orange-accent)',
                            fontWeight: '800',
                            fontSize: '12px',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: System Settings */}
        {activeSubTab === 'system' && (
          <div className="tab-view animate-fade-in">
            {!isSuperAdmin ? (
              <div className="glass-panel" style={{ padding: '50px 30px', textAlign: 'center', backgroundColor: 'var(--color-white)' }}>
                <span style={{ fontSize: '64px' }}>🔒</span>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-charcoal-deep)', marginTop: '20px' }}>
                  접근 권한 제한 (최고 관리자 전용)
                </h3>
                <p style={{ fontSize: '14.5px', color: 'var(--color-gray-dark)', maxWidth: '450px', margin: '12px auto 0', lineHeight: '1.6' }}>
                  데이터베이스 접속 권한, 백업 복구, API 토큰 키 발급 등 인프라 설정 영역은 **최고 관리자(Level 2)** 외에 일반 관리자는 접근할 수 없습니다.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <button 
                    type="button" 
                    className="subscribe-btn"
                    style={{ padding: '10px 24px', height: 'auto', borderRadius: '4px' }}
                    onClick={() => handleSimulateRole('super_admin')}
                  >
                    최고 관리자 권한으로 변경하여 테스트하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '10px' }}>
                  ⚙️ 데이터베이스 & 인프라 권한 설정 (Level 2 Authorized)
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div style={{ padding: '20px', background: 'var(--color-sand-light)', borderRadius: '6px' }}>
                    <h4 style={{ fontWeight: '800', marginBottom: '8px' }}>데이터베이스 백업 스케줄</h4>
                    <span style={{ fontSize: '13px', color: 'var(--color-gray-dark)', display: 'block', marginBottom: '12px' }}>
                      일일 오전 04:00 자동 스냅샷 백업 수행 중
                    </span>
                    <button 
                      type="button" 
                      className="subscribe-btn" 
                      style={{ height: '36px', fontSize: '12px', padding: '0 16px', borderRadius: '4px' }}
                      onClick={() => alert('즉시 백업 인스턴스가 시작되었습니다.')}
                    >
                      즉시 백업 진행
                    </button>
                  </div>

                  <div style={{ padding: '20px', background: 'var(--color-sand-light)', borderRadius: '6px' }}>
                    <h4 style={{ fontWeight: '800', marginBottom: '8px' }}>외부 API 및 Supabase 연동 상태</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ width: '10px', height: '10px', background: '#2ec4b6', borderRadius: '50%' }} />
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>Active (연결 상태 완벽)</span>
                    </div>
                    <button 
                      type="button" 
                      className="subscribe-btn" 
                      style={{ height: '36px', fontSize: '12px', padding: '0 16px', borderRadius: '4px', background: '#aaa' }}
                      onClick={() => alert('Supabase 연결 검증을 재개합니다.')}
                    >
                      커넥션 헬스 체크
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-outer-container {
          display: flex;
          min-height: 90vh;
          margin-top: 100px;
          background-color: var(--color-sand-light);
        }

        /* Sidebar styling */
        .admin-sidebar {
          width: 280px;
          background-color: var(--color-white);
          border-right: 1px solid var(--color-gray-light);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--color-gray-light);
        }

        .brand-logo {
          font-size: 28px;
        }

        .brand-title {
          font-size: 15px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin: 0;
        }

        .brand-subtitle {
          font-size: 11px;
          color: var(--color-gray-medium);
          font-weight: 700;
          display: block;
        }

        .role-badge-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .role-badge {
          font-size: 12.5px;
          font-weight: 800;
          padding: 8px;
          border-radius: 4px;
          text-align: center;
        }

        .role-badge.super {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
          border: 1px solid rgba(229, 76, 28, 0.2);
        }

        .role-badge.staff {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
          border: 1px solid rgba(10, 92, 54, 0.2);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          font-size: 14px;
          font-weight: 700;
          color: var(--color-gray-dark);
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-item:hover, .nav-item.active {
          background-color: var(--color-sand-light);
          color: var(--color-emerald-deep);
        }

        .indicator-dot {
          background-color: var(--color-orange-accent);
          color: var(--color-white);
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: var(--border-radius-full);
        }

        /* Simulator Styles */
        .simulator-panel {
          padding: 16px;
          background-color: var(--color-sand-light);
          border-radius: 6px;
          border: 1px solid var(--color-gray-light);
        }

        .sim-title {
          font-size: 12px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin-bottom: 6px;
        }

        .sim-desc {
          font-size: 11px;
          color: var(--color-gray-dark);
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .sim-buttons {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sim-btn {
          width: 100%;
          padding: 8px;
          font-size: 11.5px;
          font-weight: 700;
          border-radius: 4px;
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          color: var(--color-gray-dark);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sim-btn:hover, .sim-btn.active {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          border-color: var(--color-emerald-deep);
        }

        .sim-btn.reset {
          background-color: #f1f1f1;
          color: #666;
        }

        .sim-btn.reset:hover {
          background-color: #ddd;
        }

        /* Main Content Container */
        .admin-main-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 2px solid var(--color-gray-light);
          padding-bottom: 20px;
        }

        .breadcrumb {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--color-gray-medium);
        }

        .header-title {
          font-size: 26px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin: 4px 0 0 0;
          letter-spacing: -0.5px;
        }

        .exit-btn {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--color-emerald-deep);
          text-decoration: underline;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-md);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: var(--shadow-subtle);
        }

        .stat-label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }

        .stat-val {
          font-size: 28px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
        }

        .stat-sub {
          font-size: 11.5px;
          color: var(--color-gray-medium);
          font-weight: 600;
        }

        /* Alert Box */
        .alert-box {
          padding: 14px 18px;
          border-radius: 4px;
          font-size: 13.5px;
          font-weight: 700;
        }

        .alert-box.success {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
          border: 1px solid var(--color-emerald-light);
        }

        .alert-box.error {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
          border: 1px solid rgba(229, 76, 28, 0.2);
        }

        /* Table */
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13.5px;
        }

        .admin-table th, .admin-table td {
          padding: 16px;
          border-bottom: 1px solid var(--color-gray-light);
        }

        .admin-table th {
          background-color: var(--color-sand-light);
          color: var(--color-charcoal-deep);
          font-weight: 800;
        }

        .action-btn {
          padding: 8px 16px;
          font-size: 12.5px;
          font-weight: 800;
          border-radius: 4px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .action-btn.approve {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
        }

        .action-btn.approve:hover:not(:disabled) {
          background-color: var(--color-emerald-medium);
        }

        .action-btn.reject {
          background-color: var(--color-orange-accent);
          color: var(--color-white);
        }

        .action-btn.reject:hover:not(:disabled) {
          background-color: #e54c1c;
        }

        .action-btn.disabled {
          background-color: var(--color-sand-medium) !important;
          color: #999 !important;
          cursor: not-allowed;
          opacity: 0.8;
        }

        @media (max-width: 1024px) {
          .admin-outer-container {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--color-gray-light);
          }
        }
      `}</style>
    </div>
  );
}
