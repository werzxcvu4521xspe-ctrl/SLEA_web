'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingBrands, setPendingBrands] = useState([]);
  const [approvedBrands, setApprovedBrands] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const checkAdminSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const role = session.user.user_metadata?.role;
      if (role !== 'admin') {
        alert('관리자 권한이 없습니다. 마이페이지로 이동합니다.');
        router.push('/mypage');
        return;
      }

      setIsAdmin(true);
      await loadBrands();
    };

    checkAdminSession();
  }, [router]);

  const loadBrands = async () => {
    try {
      // Load pending
      const { data: pending, error: pendingErr } = await supabase
        .from('archives')
        .select('*')
        .eq('status', 'pending');

      // Load approved
      const { data: approved, error: approvedErr } = await supabase
        .from('archives')
        .select('*')
        .eq('status', 'approved');

      // Local storage fallback for simulation demo flow
      const localMockBrand = localStorage.getItem('sejong_mock_brand');
      let parsedMock = [];
      if (localMockBrand) {
        parsedMock = [JSON.parse(localMockBrand)];
      }

      if (pendingErr || approvedErr || (!pending && !approved)) {
        // Fallback Simulation Data
        const mockPending = parsedMock.filter((b) => b.status === 'pending');
        const mockApproved = parsedMock.filter((b) => b.status === 'approved');

        setPendingBrands(mockPending.length > 0 ? mockPending : [
          {
            id: 'mock-pending-1',
            company_name: '세종 복숭아 브레드',
            representative: '황종민',
            category: 'F&B',
            address: '세종시 조치원읍 평리 12-4',
            short_desc: '조치원 복숭아 청을 넣어 빚은 유기농 발효 복숭아 식빵 전문점',
            status: 'pending'
          }
        ]);
        setApprovedBrands(mockApproved);
      } else {
        setPendingBrands([...(pending || []), ...parsedMock.filter((b) => b.status === 'pending')]);
        setApprovedBrands([...(approved || []), ...parsedMock.filter((b) => b.status === 'approved')]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setMsg({ type: '', text: '' });
    
    try {
      const { error } = await supabase
        .from('archives')
        .update({ status })
        .eq('id', id);

      if (error && error.code !== '42P01') {
        setMsg({ type: 'error', text: `수정 실패: ${error.message}` });
      } else {
        // Simulation or direct success
        setMsg({
          type: 'success',
          text: `브랜드 상태가 성공적으로 [${status === 'approved' ? '승인됨' : '반려됨'}] 상태로 변경되었습니다!`
        });

        // Update local storage if matched
        const localMockBrand = localStorage.getItem('sejong_mock_brand');
        if (localMockBrand) {
          const parsed = JSON.parse(localMockBrand);
          if (parsed.id === id) {
            parsed.status = status;
            localStorage.setItem('sejong_mock_brand', JSON.stringify(parsed));
          }
        }

        await loadBrands();
      }
    } catch (err) {
      setMsg({ type: 'error', text: '서버 연동 오류가 발생했습니다.' });
    }
  };

  if (loading) {
    return (
      <div className="admin-loading container">
        <p>관리자 데이터를 조회하고 있습니다...</p>
        <style jsx>{`
          .admin-loading {
            padding: 100px 20px;
            text-align: center;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="admin-page-wrapper container">
      <div className="admin-header-row">
        <h2>👑 협회 아카이빙 승인 관리자 대시보드</h2>
        <button type="button" className="mypage-nav-btn" onClick={() => router.push('/mypage')}>
          ← 마이페이지로
        </button>
      </div>

      {msg.text && (
        <div className={`alert-box ${msg.type}`}>
          {msg.text}
        </div>
      )}

      {/* Pending Brands Section */}
      <div className="admin-panel glass-panel">
        <h3 className="panel-title">🕒 승인 대기 목록 ({pendingBrands.length})</h3>
        {pendingBrands.length > 0 ? (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>브랜드/공간명</th>
                  <th>대표자</th>
                  <th>카테고리</th>
                  <th>위치 주소</th>
                  <th>한 줄 소개</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {pendingBrands.map((brand) => (
                  <tr key={brand.id}>
                    <td className="bold-text">{brand.company_name}</td>
                    <td>{brand.representative}</td>
                    <td><span className="badge badge-apply">{brand.category}</span></td>
                    <td>{brand.address}</td>
                    <td>{brand.short_desc}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="approve-btn"
                          onClick={() => handleUpdateStatus(brand.id, 'approved')}
                        >
                          승인
                        </button>
                        <button
                          type="button"
                          className="reject-btn"
                          onClick={() => handleUpdateStatus(brand.id, 'rejected')}
                        >
                          반려
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-table-msg">대기 중인 브랜드 등록 건이 없습니다.</p>
        )}
      </div>

      {/* Approved Brands Section */}
      <div className="admin-panel glass-panel">
        <h3 className="panel-title">✅ 승인 완료 목록 ({approvedBrands.length})</h3>
        {approvedBrands.length > 0 ? (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>브랜드/공간명</th>
                  <th>대표자</th>
                  <th>카테고리</th>
                  <th>위치 주소</th>
                  <th>한 줄 소개</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {approvedBrands.map((brand) => (
                  <tr key={brand.id}>
                    <td className="bold-text">{brand.company_name}</td>
                    <td>{brand.representative}</td>
                    <td><span className="badge badge-emerald">{brand.category}</span></td>
                    <td>{brand.address}</td>
                    <td>{brand.short_desc}</td>
                    <td>
                      <button
                        type="button"
                        className="reject-btn-secondary"
                        onClick={() => handleUpdateStatus(brand.id, 'rejected')}
                      >
                        승인 취소 (반려)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-table-msg">승인된 브랜드 공간이 아직 없습니다.</p>
        )}
      </div>

      <style jsx>{`
        .admin-page-wrapper {
          padding-top: 40px;
          padding-bottom: 100px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .admin-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid var(--color-emerald-deep);
          padding-bottom: 16px;
        }

        .admin-header-row h2 {
          font-size: 24px;
          color: var(--color-charcoal-deep);
        }

        .mypage-nav-btn {
          border: 1px solid var(--color-gray-dark);
          color: var(--color-gray-dark);
          padding: 10px 20px;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
        }

        .mypage-nav-btn:hover {
          background-color: var(--color-sand-medium);
        }

        .admin-panel {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          padding: 24px;
        }

        .panel-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--color-charcoal-deep);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }

        .admin-table th, .admin-table td {
          padding: 14px;
          border-bottom: 1px solid var(--color-gray-light);
        }

        .admin-table th {
          background-color: var(--color-sand-light);
          color: var(--color-charcoal-deep);
          font-weight: 700;
        }

        .bold-text {
          font-weight: 700;
          color: var(--color-charcoal-deep);
        }

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .approve-btn {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          padding: 6px 12px;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
        }

        .approve-btn:hover {
          background-color: var(--color-emerald-medium);
        }

        .reject-btn {
          background-color: var(--color-orange-accent);
          color: var(--color-white);
          padding: 6px 12px;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
        }

        .reject-btn:hover {
          background-color: #e54c1c;
        }

        .reject-btn-secondary {
          border: 1px solid var(--color-orange-accent);
          color: var(--color-orange-accent);
          padding: 6px 12px;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
        }

        .reject-btn-secondary:hover {
          background-color: var(--color-orange-light);
        }

        .empty-table-msg {
          padding: 40px 0;
          text-align: center;
          color: var(--color-gray-dark);
          font-weight: 600;
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
