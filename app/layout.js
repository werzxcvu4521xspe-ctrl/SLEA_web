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
    --color-emerald-light: #a9ded1 !important;
    --color-emerald-pale: #effaf7 !important;
    --color-brand-navy: #111111 !important;
    --color-brand-cyan: #6cbfab !important;
    --color-brand-green: #6cbfab !important;
    --color-button-solid: #ff5a2a !important;
    --color-button-solid-hover: #111111 !important;
    --color-orange-accent: #ff5a2a !important;
    --color-orange-light: #fff1eb !important;
    --brand-solid: #111111 !important;
    --brand-soft: #effaf7 !important;
    --brand-solid-hover: #111111 !important;
    --banner-height: 0px !important;
  }

  .gnb-bar,
  .header-container.scrolled .gnb-bar {
    background: #ffffff !important;
    border-bottom: 1px solid #e0e0e0 !important;
    box-shadow: none !important;
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
    background: var(--brand-solid) !important;
  }

  .page-hero-banner::after {
    display: none !important;
  }

  .nav-links a:hover,
  .nav-links a.active,
  .tab-btn.active,
  .tab-btn:hover {
    color: #ff5a2a !important;
  }

  .nav-links a::after,
  .tab-btn.active {
    border-bottom-color: #ff5a2a !important;
  }

  .nav-links a::after {
    background: var(--brand-solid) !important;
  }

  .menu-btn .bar {
    background-color: #121413 !important;
  }

  @media (min-width: 1024px) {
    .gnb-bar,
    .header-container.scrolled .gnb-bar {
      background: #111111 !important;
      border-bottom-color: #111111 !important;
      box-shadow: none !important;
    }

    .logo-text,
    .icon-btn,
    .mega-trigger-btn,
    .nav-links a {
      color: #ffffff !important;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #ff5a2a !important;
    }

    .menu-btn .bar {
      background-color: #ffffff !important;
    }
  }

  .map-display,
  .map-visual-box {
    background: var(--brand-soft) !important;
  }

  .map-graphic-bg {
    background-image: none !important;
    background-color: #effaf7 !important;
  }

  .pulse-marker {
    background-color: rgba(108, 191, 171, 0.28) !important;
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
    color: #111111 !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #ff5a2a !important;
  }
`;

export const metadata = {
  title: "세종로컬창업가협회 l SELO",
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
