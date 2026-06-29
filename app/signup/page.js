'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('entrepreneur'); // Default to entrepreneur
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim(),
            role: role
          }
        }
      });

      if (error) {
        setErrorMsg(error.message || '회원가입 중 오류가 발생했습니다.');
      } else if (data) {
        // If email confirmation is enabled, session will be null
        if (data.user && !data.session) {
          setSuccessMsg('입력하신 이메일로 인증 링크가 발송되었습니다! 메일함(또는 스팸함)을 확인하셔서 인증을 완료해 주세요. 완료 후 로그인이 가능합니다.');
        } else {
          setSuccessMsg('회원가입이 정상 완료되었습니다! 로그인 창으로 이동합니다.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      }
    } catch (e) {
      setErrorMsg('서버와 통신하는 도중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel animate-fade-in">
        <h2 className="auth-title">회원가입</h2>
        <p className="auth-subtitle">세종로컬창업가협회의 커뮤니티 가입을 진행합니다.</p>

        {errorMsg && <div className="error-alert">{errorMsg}</div>}
        {successMsg && <div className="success-alert">{successMsg}</div>}

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="name">이름 / 담당자명</label>
            <input
              id="name"
              type="text"
              required
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">이메일 주소</label>
            <input
              id="email"
              type="email"
              required
              placeholder="example@sejong.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">비밀번호 (6자 이상)</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              minLength={6}
            />
          </div>

          {/* Role Selection */}
          <div className="input-group">
            <label>회원 등급 선택</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${role === 'entrepreneur' ? 'active' : ''}`}
                onClick={() => setRole('entrepreneur')}
              >
                🏪 로컬 창업가 회원
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'visitor' ? 'active' : ''}`}
                onClick={() => setRole('visitor')}
              >
                👥 일반 방문자 회원
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? '처리 중...' : '가입하기'}
          </button>
        </form>

        <div className="auth-footer-links">
          <span>이미 계정이 있으신가요?</span>
          <Link href="/login" className="auth-redirect-link">
            로그인 하러가기
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
        }

        .auth-card {
          max-width: 440px;
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
          margin-bottom: 30px;
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

        .success-alert {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
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

        .role-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .role-btn {
          height: 44px;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          color: var(--color-gray-dark);
          background-color: var(--color-sand-light);
          transition: all 0.2s ease;
        }

        .role-btn.active {
          border-color: var(--color-emerald-deep);
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
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
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          margin-top: 24px;
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
