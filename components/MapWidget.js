'use client';

import { useState } from 'react';

export default function MapWidget({ address, companyName }) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

  return (
    <div className="map-widget-container glass-panel">
      {/* Mock Map Visual (Highly Aesthetic) */}
      <div className="map-visual-box">
        <div className="map-placeholder-bg">
          <div className="pulse-marker"></div>
          <span className="location-pin">📍</span>
        </div>
        <span className="map-overlay-label">세종로컬맵 뷰어</span>
      </div>

      {/* Address Details */}
      <div className="address-details">
        <div className="address-text-row">
          <span className="address-lbl">소재지 주소</span>
          <p className="address-val">{address}</p>
        </div>

        {/* Action Buttons */}
        <div className="map-actions">
          <button type="button" className="action-btn copy-btn" onClick={handleCopyAddress}>
            {copied ? '✅ 복사 완료' : '📋 주소 복사'}
          </button>
          <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer" className="action-btn map-link kakao">
            카카오 맵
          </a>
          <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="action-btn map-link naver">
            네이버 지도
          </a>
        </div>
      </div>

      <style jsx>{`
        .map-widget-container {
          overflow: hidden;
          background: var(--color-white);
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
        }

        .map-visual-box {
          position: relative;
          width: 100%;
          height: 180px;
          background-color: #d8e5e0;
          overflow: hidden;
        }

        /* Styling an aesthetic mock map with grids and a marker */
        .map-placeholder-bg {
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(var(--color-emerald-pale) 20%, transparent 20%),
            radial-gradient(var(--color-emerald-pale) 20%, transparent 20%);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .location-pin {
          font-size: 32px;
          z-index: 3;
          animation: bounce 2s infinite ease-in-out;
        }

        .pulse-marker {
          position: absolute;
          width: 50px;
          height: 50px;
          background-color: rgba(22, 131, 102, 0.2);
          border-radius: 50%;
          z-index: 1;
          animation: pulse 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .map-overlay-label {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 4;
          background: rgba(0, 0, 0, 0.65);
          color: var(--color-white);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
        }

        .address-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .address-text-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .address-lbl {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-gray-dark);
          letter-spacing: 0.5px;
        }

        .address-val {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-charcoal-deep);
          line-height: 1.5;
        }

        .map-actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        @media (min-width: 480px) {
          .map-actions {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .action-btn {
          font-size: 13px;
          font-weight: 700;
          padding: 10px 4px;
          border-radius: var(--border-radius-sm);
          text-align: center;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .copy-btn {
          background-color: var(--color-sand-medium);
          color: var(--color-charcoal-deep);
        }

        .copy-btn:hover {
          background-color: var(--color-gray-light);
        }

        .map-link {
          color: var(--color-white);
        }

        .map-link.kakao {
          background-color: #fee500;
          color: #191919;
        }

        .map-link.kakao:hover {
          background-color: #e6ce00;
        }

        .map-link.naver {
          background-color: #03cf5d;
        }

        .map-link.naver:hover {
          background-color: #02b350;
        }
      `}</style>
    </div>
  );
}
