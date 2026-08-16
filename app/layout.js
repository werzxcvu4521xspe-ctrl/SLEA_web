import { Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SideScrollNavigator from "@/components/SideScrollNavigator";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

const gradientColorOverride = `
  :root {
    --color-emerald-deep: #1456c8 !important;
    --color-emerald-medium: #0a9ee8 !important;
    --color-emerald-light: #11c7c7 !important;
    --color-emerald-pale: #f0f9ff !important;
    --color-brand-navy: #113274 !important;
    --color-brand-cyan: #08a7d8 !important;
    --color-brand-green: #00bf63 !important;
    --color-button-solid: #1456c8 !important;
    --color-button-solid-hover: #0f48ad !important;
    --brand-gradient: linear-gradient(105deg, #113274 0%, #1456c8 42%, #08a7d8 68%, #00bf63 100%) !important;
    --brand-gradient-soft: linear-gradient(135deg, rgba(20, 86, 200, 0.12) 0%, rgba(8, 167, 216, 0.12) 50%, rgba(0, 191, 99, 0.10) 100%) !important;
    --brand-gradient-hover: linear-gradient(105deg, #0f2b65 0%, #0f68d8 44%, #06b6d4 72%, #00c967 100%) !important;
  }

  .top-banner {
    background: var(--brand-gradient) !important;
  }

  .gnb-bar,
  .header-container.scrolled .gnb-bar {
    background: rgba(255, 255, 255, 0.96) !important;
    border-bottom: 1px solid #e0e0e0 !important;
    box-shadow: 0 8px 24px rgba(22, 22, 22, 0.05) !important;
  }

  .logo-text,
  .icon-btn,
  .mega-trigger-btn {
    color: #121413 !important;
  }

  .nav-links a {
    color: #525252 !important;
  }

  .page-hero-banner {
    background: var(--brand-gradient) !important;
  }

  .page-hero-banner::after {
    background:
      radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 62%),
      radial-gradient(circle at 80% 20%, rgba(0, 191, 99, 0.2) 0%, transparent 70%) !important;
  }

  .nav-links a:hover,
  .nav-links a.active,
  .logo-text span,
  .tab-btn.active,
  .tab-btn:hover {
    color: #1456c8 !important;
  }

  .nav-links a::after,
  .tab-btn.active {
    border-bottom-color: #1456c8 !important;
  }

  .nav-links a::after {
    background: var(--brand-gradient) !important;
  }

  .menu-btn .bar {
    background-color: #121413 !important;
  }

  .map-display,
  .map-visual-box {
    background: var(--brand-gradient-soft) !important;
  }

  .map-graphic-bg {
    background-image:
      radial-gradient(rgba(10, 158, 232, 0.28) 20%, transparent 20%),
      radial-gradient(rgba(0, 191, 99, 0.18) 20%, transparent 20%) !important;
  }

  .pulse-marker {
    background-color: rgba(17, 199, 199, 0.28) !important;
  }

  .map-link.naver {
    background: var(--color-button-solid) !important;
  }

  .map-link.naver:hover {
    background: var(--color-button-solid-hover) !important;
  }

  .primary-cta-link,
  .subscribe-btn,
  .auth-submit-btn,
  .form-submit-btn,
  .submit-btn,
  .goto-login-btn,
  .apply-btn,
  .search-submit,
  .content-action-btn.primary,
  .section-filter-chip.active,
  .gallery-tag,
  .step-node.active {
    background: var(--color-button-solid) !important;
    border-color: transparent !important;
    color: #ffffff !important;
  }

  .primary-cta-link:hover,
  .subscribe-btn:hover,
  .auth-submit-btn:hover,
  .form-submit-btn:hover,
  .submit-btn:hover,
  .goto-login-btn:hover,
  .apply-btn:hover,
  .search-submit:hover,
  .content-action-btn.primary:hover {
    background: var(--color-button-solid-hover) !important;
  }

  .promo-inner,
  .mega-menu-overlay {
    background: var(--brand-gradient) !important;
  }

  .badge-emerald,
  .file-type-icon,
  .step-node.done {
    background: var(--brand-gradient-soft) !important;
    color: #1456c8 !important;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #1456c8 0%, #00bf63 100%) !important;
  }
`;

export const metadata = {
  title: "세종로컬창업가협회 l SEJONG LOCAL",
  description: "세종시 로컬 크리에이터와 브랜드의 성장 가치와 공간을 기록하는 아카이빙 플랫폼",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <style dangerouslySetInnerHTML={{ __html: gradientColorOverride }} />
        <Navigation />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
        <SideScrollNavigator />
        <Footer />
      </body>
    </html>
  );
}
