'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

function FindAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'id';

  const [activeTab, setActiveTab] = useState(tabParam);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Find ID state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foundEmail, setFoundEmail] = useState('');

  // Reset password state
  const [email, setEmail] = useState('');

  useEffect(() => {
    setActiveTab(tabParam);
    setErrorMsg('');
    setSuccessMsg('');
    setFoundEmail('');
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.push(`/find-auth?tab=${tabName}`, { scroll: false });
  };

  const handleFindId = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    setErrorMsg('');
    setFoundEmail('');

    // Simulate search from DB/mock
    setTimeout(() => {
      // Simple mock logic for demonstration
      if (name.trim() === '장유찬' || name.trim() === '홍길동') {
        setFoundEmail('yuchan*****@gmail.com');
      } else {
        setErrorMsg('입력하신 정보와 일치하는 가입 이메일을 찾을 수 없습니다.');
      }
    }, 800);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/mypage`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('비밀번호 재설정 메일이 전송되었습니다. 메일함(또는 스팸함)을 확인해 주세요.');
      }
    } catch (err) {
      setErrorMsg('재설정 요청 과정에 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel animate-fade-in">
        <h2 className="auth-title">계정 찾기</h2>
        <p className="auth-subtitle" style={{ marginBottom: '20px' }}>로그인 정보를 잊으셨나요?</p>

        {/* Tab switcher */}
        <div className="nav-tab-bar" style={{ marginBottom: '24px' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'id' ? 'active' : ''}`}
            onClick={() => handleTabChange('id')}
            style={{ flex: 1, padding: '10px 0', fontSize: '14px' }}
          >
            아이디(이메일) 찾기
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => handleTabChange('password')}
            style={{ flex: 1, padding: '10px 0', fontSize: '14px' }}
          >
            비밀번호 재설정
          </button>
        </div>

        {errorMsg && <div className="error-alert">{errorMsg}</div>}
        {successMsg && (
          <div className="alert-box success" style={{ marginBottom: '20px', padding: '12px 16px', fontSize: '13px', borderRadius: '4px' }}>
            {successMsg}
          </div>
        )}

        {/* Tab 1: Find ID */}
        {activeTab === 'id' && (
          <form className="auth-form" onSubmit={handleFindId}>
            <div className="input-group">
              <label htmlFor="find-name">이름</label>
              <input
                id="find-name"
                type="text"
                required
                placeholder="가입자 이름 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="find-phone">휴대폰 번호</label>
              <input
                id="find-phone"
                type="tel"
                required
                placeholder="예) 010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="auth-input"
              />
            </div>
            <button type="submit" className="auth-submit-btn">
              가입 아이디 찾기
            </button>

            {foundEmail && (
              <div 
                style={{ 
                  marginTop: '20px', 
                  padding: '16px', 
                  background: 'var(--color-emerald-pale)', 
                  border: '1px solid var(--color-emerald-light)', 
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '14px'
                }}
              >
                일치하는 가입 이메일:<br />
                <strong style={{ fontSize: '16px', color: 'var(--color-emerald-deep)' }}>{foundEmail}</strong>
              </div>
            )}
          </form>
        )}

        {/* Tab 2: Reset Password */}
        {activeTab === 'password' && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="input-group">
              <label htmlFor="reset-email">가입 이메일 주소</label>
              <input
                id="reset-email"
                type="email"
                required
                placeholder="example@sejong.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? '전송 요청 중...' : '비밀번호 재설정 메일 발송'}
            </button>
          </form>
        )}

        <div className="auth-footer-links" style={{ marginTop: '24px', justifyContent: 'space-between', fontSize: '13px' }}>
          <Link href="/login" className="auth-redirect-link" style={{ color: 'var(--color-gray-dark)', textDecoration: 'none' }}>
            ← 로그인 페이지로
          </Link>
          <Link href="/signup" className="auth-redirect-link">
            회원가입 하기
          </Link>
        </div>
      </div>

      <style jsx>{`
        .auth-page-container {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          background-color: var(--color-sand-light);
          margin-top: 100px;
        }

        .auth-card {
          max-width: 420px;
          width: 100%;
          background: var(--color-white);
          padding: 40px;
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-gray-light);
        }

        .auth-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--color-charcoal-deep);
          margin-bottom: 8px;
          text-align: center;
        }

        .auth-subtitle {
          font-size: 13px;
          color: var(--color-gray-dark);
          text-align: center;
        }

        .error-alert {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-gray-dark);
          letter-spacing: 0.5px;
          text-align: left;
        }

        .auth-input {
          height: 48px;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          padding: 0 16px;
          outline: none;
          font-size: 14px;
          font-weight: 600;
          background-color: var(--color-sand-light);
          transition: border-color 0.2s ease;
        }

        .auth-input:focus {
          border-color: var(--color-emerald-deep);
          background-color: var(--color-white);
        }

        .auth-submit-btn {
          height: 50px;
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          font-size: 15px;
          font-weight: 700;
          border-radius: var(--border-radius-sm);
          text-align: center;
          margin-top: 10px;
          transition: background-color 0.2s ease;
        }

        .auth-submit-btn:hover {
          background-color: var(--color-emerald-medium);
        }

        .auth-submit-btn:disabled {
          background-color: var(--color-gray-medium);
          cursor: not-allowed;
        }

        .auth-footer-links {
          display: flex;
          color: var(--color-gray-dark);
        }

        .auth-redirect-link {
          color: var(--color-emerald-medium);
          font-weight: 700;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default function FindAuthPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading recovery page...</div>}>
      <FindAuthContent />
    </Suspense>
  );
}
