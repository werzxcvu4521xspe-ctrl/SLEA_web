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

const paletteOverride = `
  :root {
    --color-emerald-deep: #6cbfab !important;
    --color-emerald-medium: #6cbfab !important;
    --color-emerald-light: #ddf2ec !important;
    --color-emerald-pale: #ddf2ec !important;
    --color-brand-navy: #3f1d14 !important;
    --color-brand-cyan: #6cbfab !important;
    --color-brand-green: #ddf2ec !important;
    --color-button-solid: #ff5a2a !important;
    --color-button-solid-hover: #3f1d14 !important;
    --color-orange-accent: #ff5a2a !important;
    --color-orange-light: #f8f4ef !important;
    --color-sand-warm: #f8f4ef !important;
    --color-sand-medium: #ddf2ec !important;
    --color-charcoal-deep: #181614 !important;
    --color-charcoal-medium: #3f1d14 !important;
    --color-charcoal-light: #3f1d14 !important;
    --color-gray-dark: #181614 !important;
    --color-gray-medium: #3f1d14 !important;
    --color-gray-light: #ddf2ec !important;
    --brand-solid: #3f1d14 !important;
    --brand-soft: #ddf2ec !important;
    --brand-solid-hover: #3f1d14 !important;
  }

  .top-banner {
    background: var(--brand-solid) !important;
  }

  .gnb-bar,
  .header-container.scrolled .gnb-bar {
    background: rgba(255, 255, 255, 0.96) !important;
    border-bottom: 1px solid #ddf2ec !important;
    box-shadow: 0 8px 24px rgba(63, 29, 20, 0.06) !important;
  }

  .logo-text,
  .icon-btn,
  .mega-trigger-btn {
    color: #181614 !important;
  }

  .nav-links a {
    color: #181614 !important;
  }

  .page-hero-banner {
    background: var(--brand-solid) !important;
  }

  .page-hero-banner::after {
    display: none !important;
  }

  .nav-links a:hover,
  .nav-links a.active,
  .logo-text span,
  .tab-btn.active,
  .tab-btn:hover {
    color: #6cbfab !important;
  }

  .nav-links a::after,
  .tab-btn.active {
    border-bottom-color: #6cbfab !important;
  }

  .nav-links a::after {
    background: var(--color-emerald-deep) !important;
  }

  .menu-btn .bar {
    background-color: #181614 !important;
  }

  .map-display,
  .map-visual-box {
    background: var(--brand-soft) !important;
  }

  .map-graphic-bg {
    background-image: none !important;
    background-color: #ddf2ec !important;
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
    background: var(--brand-solid) !important;
  }

  .badge-emerald,
  .file-type-icon,
  .step-node.done {
    background: var(--brand-soft) !important;
    color: #181614 !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #6cbfab !important;
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
        <style dangerouslySetInnerHTML={{ __html: paletteOverride }} />
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
