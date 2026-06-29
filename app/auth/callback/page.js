'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusMsg, setStatusMsg] = useState('이메일 인증 정보를 확인하는 중입니다...');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Retrieve session to check if auth state succeeded
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setErrorMsg(error.message || '인증 과정 중 오류가 발생했습니다.');
          return;
        }

        if (session) {
          setStatusMsg('인증이 정상 완료되었습니다! 마이페이지로 이동합니다.');
          setTimeout(() => {
            router.push('/mypage');
            router.refresh();
          }, 2000);
        } else {
          // Fallback check: wait briefly for supabase-js client to parse hashes/tokens
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession) {
              setStatusMsg('인증 성공! 마이페이지로 이동합니다.');
              authListener.subscription.unsubscribe();
              setTimeout(() => {
                router.push('/mypage');
                router.refresh();
              }, 2000);
            }
          });

          // Wait maximum 5 seconds, otherwise redirect to login
          const timeoutId = setTimeout(() => {
            authListener.subscription.unsubscribe();
            setErrorMsg('인증 세션을 가져오지 못했습니다. 로그인 페이지에서 로그인을 다시 시도해 주세요.');
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          }, 5000);

          return () => {
            clearTimeout(timeoutId);
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err) {
        setErrorMsg('서버와 인증을 처리하는 도중 예상치 못한 오류가 발생했습니다.');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="callback-container">
      <div className="callback-card glass-panel animate-fade-in">
        {!errorMsg ? (
          <>
            <div className="spinner"></div>
            <p className="callback-status">{statusMsg}</p>
          </>
        ) : (
          <>
            <div className="error-icon">⚠️</div>
            <p className="callback-error">{errorMsg}</p>
            <button className="goto-login-btn" onClick={() => router.push('/login')}>
              로그인 화면으로 이동
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .callback-container {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          background-color: var(--color-sand-light);
        }

        .callback-card {
          max-width: 460px;
          width: 100%;
          background: var(--color-white);
          padding: 40px;
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-gray-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--color-gray-light);
          border-top-color: var(--color-emerald-deep);
          border-radius: 50%;
          animation: spin 1s infinite linear;
        }

        .error-icon {
          font-size: 48px;
        }

        .callback-status {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-charcoal-deep);
        }

        .callback-error {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-orange-accent);
          line-height: 1.6;
        }

        .goto-login-btn {
          height: 46px;
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          font-size: 14px;
          font-weight: 700;
          border-radius: var(--border-radius-sm);
          padding: 0 24px;
          transition: background-color 0.2s ease;
        }

        .goto-login-btn:hover {
          background-color: var(--color-emerald-medium);
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
