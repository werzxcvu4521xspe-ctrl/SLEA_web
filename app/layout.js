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
    --color-emerald-deep: #3f1d14 !important;
    --color-emerald-medium: #6cbfab !important;
    --color-emerald-light: #8bd1c1 !important;
    --color-emerald-pale: #e8f6f2 !important;
    --color-brand-navy: #3f1d14 !important;
    --color-brand-cyan: #6cbfab !important;
    --color-brand-green: #8bd1c1 !important;
    --color-button-solid: #3f1d14 !important;
    --color-button-solid-hover: #5a2a1d !important;
    --color-orange-accent: #6cbfab !important;
    --color-orange-light: #e8f6f2 !important;
    --brand-gradient: linear-gradient(105deg, #3f1d14 0%, #5a2a1d 38%, #6cbfab 100%) !important;
    --brand-gradient-soft: linear-gradient(135deg, rgba(63, 29, 20, 0.10) 0%, rgba(108, 191, 171, 0.18) 100%) !important;
    --brand-gradient-hover: linear-gradient(105deg, #2d120c 0%, #4f2419 42%, #79cbb9 100%) !important;
  }

  .top-banner {
    background: var(--brand-gradient) !important;
  }

  .gnb-bar,
  .header-container.scrolled .gnb-bar {
    background: rgba(255, 255, 255, 0.96) !important;
    border-bottom: 1px solid rgba(63, 29, 20, 0.14) !important;
    box-shadow: 0 8px 24px rgba(63, 29, 20, 0.06) !important;
  }

  .logo-text,
  .icon-btn,
  .mega-trigger-btn {
    color: #3f1d14 !important;
  }

  .nav-links a {
    color: #6a493f !important;
  }

  .page-hero-banner {
    background: var(--brand-gradient) !important;
  }

  .page-hero-banner::after {
    background:
      radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 62%),
      radial-gradient(circle at 80% 20%, rgba(108, 191, 171, 0.28) 0%, transparent 70%) !important;
  }

  .nav-links a:hover,
  .nav-links a.active,
  .logo-text span,
  .tab-btn.active,
  .tab-btn:hover {
    color: #3f1d14 !important;
  }

  .nav-links a::after,
  .tab-btn.active {
    border-bottom-color: #6cbfab !important;
  }

  .nav-links a::after {
    background: var(--brand-gradient) !important;
  }

  .menu-btn .bar {
    background-color: #3f1d14 !important;
  }

  .map-display,
  .map-visual-box {
    background: var(--brand-gradient-soft) !important;
  }

  .map-graphic-bg {
    background-image:
      radial-gradient(rgba(108, 191, 171, 0.32) 20%, transparent 20%),
      radial-gradient(rgba(63, 29, 20, 0.14) 20%, transparent 20%) !important;
  }

  .pulse-marker {
    background-color: rgba(108, 191, 171, 0.32) !important;
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
    color: #3f1d14 !important;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #3f1d14 0%, #6cbfab 100%) !important;
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
