'use client';

import { useState } from 'react';

export default function ProposalPage() {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('collaboration'); // collaboration, advertisement, sponsorship, mentoring
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !content) return;
    setSubmitted(true);
  };

  return (
    <div className="proposal-page-wrapper container">
      <div className="proposal-header">
        <span className="badge badge-emerald">AD & Partnership</span>
        <h2>광고 및 협업 문의</h2>
        <p>세종로컬창업가협회는 로컬 브랜드 생태계 확장을 위한 다양한 크리에이티브 협업 제안과 제휴 문의를 환영합니다.</p>
      </div>

      <div className="proposal-layout">
        {/* Left: Info card */}
        <div className="info-panel glass-panel">
          <h3>협업 제안 절차</h3>
          <ul className="step-list">
            <li>
              <div className="step-num">1</div>
              <div className="step-text">
                <strong>문의 접수</strong>
                우측 제안 서식을 통해 기본 제안서와 내용을 작성해 주시면 접수 즉시 담당자에게 전달됩니다.
              </div>
            </li>
            <li>
              <div className="step-num">2</div>
              <div className="step-text">
                <strong>기획 검토</strong>
                제출해 주신 제안서의 타당성 및 협회의 협업 로드맵 일치 여부를 영업일 기준 3일 이내에 검토합니다.
              </div>
            </li>
            <li>
              <div className="step-num">3</div>
              <div className="step-text">
                <strong>파트너 미팅</strong>
                기획 검토 후 제휴 성격에 맞춰 화상/대면 미팅을 조율하며, 구체적인 계약 조건 및 실행 계획을 논의합니다.
              </div>
            </li>
          </ul>

          <div className="contact-direct">
            <p className="direct-lbl">📧 직통 이메일 문의</p>
            <p className="direct-val">partnership@sejonglocal.org</p>
          </div>
        </div>

        {/* Right: Proposal Form */}
        <div className="form-panel glass-panel">
          {submitted ? (
            <div className="success-box">
              <span className="success-icon">✉️</span>
              <h3>제안이 성공적으로 전달되었습니다!</h3>
              <p>기입해 주신 이메일({email})을 통해 빠른 시일 내에 연락드리겠습니다.</p>
              <button type="button" className="retry-btn" onClick={() => setSubmitted(false)}>
                추가 문의 작성하기
              </button>
            </div>
          ) : (
            <form className="proposal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prop-name">담당자 이름 *</label>
                  <input
                    id="prop-name"
                    type="text"
                    required
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prop-org">회사 / 기관명</label>
                  <input
                    id="prop-org"
                    type="text"
                    placeholder="예: 세종기획"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prop-email">이메일 주소 *</label>
                  <input
                    id="prop-email"
                    type="email"
                    required
                    placeholder="example@sejong.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prop-phone">연락처 *</label>
                  <input
                    id="prop-phone"
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>문의 유형 선택 *</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="collaboration">브랜드 간 네트워킹 및 협업 제휴</option>
                  <option value="advertisement">협회 아카이빙 플랫폼 광고 게재</option>
                  <option value="sponsorship">공간 지원 및 대관 스폰서십</option>
                  <option value="mentoring">로컬 창업 멘토진/강사 참여 신청</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prop-content">제안 상세 내용 *</label>
                <textarea
                  id="prop-content"
                  required
                  rows={6}
                  placeholder="제휴 목적, 제휴 형태, 기대 효과 등을 포함하여 적어주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-btn">
                협업 제안서 접수하기
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .proposal-page-wrapper {
          padding-top: 40px;
          padding-bottom: 100px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .proposal-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 2px solid var(--color-emerald-deep);
          padding-bottom: 16px;
        }

        .proposal-header h2 {
          font-size: 28px;
          color: var(--color-charcoal-deep);
        }

        .proposal-header p {
          font-size: 15px;
          color: var(--color-gray-dark);
        }

        .proposal-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        @media (min-width: 1024px) {
          .proposal-layout {
            grid-template-columns: 0.8fr 1.2fr;
          }
        }

        .info-panel {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-panel h3 {
          font-size: 18px;
          font-weight: 800;
        }

        .step-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-list li {
          display: flex;
          gap: 16px;
        }

        .step-num {
          width: 28px;
          height: 28px;
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          flex-shrink: 0;
        }

        .step-text {
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--color-gray-dark);
        }

        .step-text strong {
          display: block;
          font-size: 15px;
          color: var(--color-charcoal-deep);
          margin-bottom: 4px;
        }

        .contact-direct {
          margin-top: 10px;
          padding-top: 20px;
          border-top: 1px solid var(--color-sand-medium);
        }

        .direct-lbl {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }

        .direct-val {
          font-size: 16px;
          font-weight: 800;
          color: var(--color-emerald-medium);
          margin-top: 4px;
        }

        .form-panel {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          padding: 30px;
        }

        .proposal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 600px) {
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

        .submit-btn {
          height: 52px;
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          font-size: 15px;
          font-weight: 700;
          border-radius: var(--border-radius-sm);
          transition: background-color 0.2s ease;
          margin-top: 10px;
        }

        .submit-btn:hover {
          background-color: var(--color-emerald-medium);
        }

        .success-box {
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .success-icon {
          font-size: 48px;
        }

        .success-box h3 {
          font-size: 18px;
          font-weight: 800;
          color: var(--color-emerald-deep);
        }

        .success-box p {
          font-size: 14px;
          color: var(--color-gray-dark);
          max-width: 400px;
          line-height: 1.5;
        }

        .retry-btn {
          background-color: var(--color-sand-light);
          border: 1px solid var(--color-gray-light);
          padding: 12px 24px;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
          font-size: 14px;
          margin-top: 10px;
        }

        .retry-btn:hover {
          background-color: var(--color-sand-medium);
        }
      `}</style>
    </div>
  );
}
