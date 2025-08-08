"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import "./globals.css";

// 헤더, 푸터 필요없는 경로 작성
const noLayoutPaths = ["/login"];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isNoLayoutPage = pathname && noLayoutPaths.includes(pathname);

  return (
    <html lang="ko">
      <body>
        {!isNoLayoutPage && <Header />}
        <main className={isNoLayoutPage ? "" : "pt-[144px] min-h-screen"}>{children}</main>
        {!isNoLayoutPage && <Footer />}
      </body>
    </html>
  );
}
