'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setErrorMsg(error.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (data?.user) {
        router.push('/mypage');
        router.refresh();
      }
    } catch (e) {
      setErrorMsg('로그인 과정에 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel animate-fade-in">
        <h2 className="auth-title">로그인</h2>
        <p className="auth-subtitle">세종로컬창업가협회 웹 포탈에 오신 것을 환영합니다.</p>

        {errorMsg && <div className="error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
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
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? '로그인 중...' : '로그인 완료'}
          </button>
        </form>

        <div className="auth-footer-links">
          <span>아직 계정이 없으신가요?</span>
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
