import { Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata = {
  title: "세종로컬창업가협회 l SEJONG LOCAL",
  description: "세종시 로컬 크리에이터와 브랜드의 성장 가치와 공간을 기록하는 아카이빙 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navigation />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
