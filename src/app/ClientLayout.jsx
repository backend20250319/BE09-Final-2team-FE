// app/ClientLayout.jsx
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const noLayoutPaths = ["/login", "/signup", "/signup/complete", "/additional-info", "/find-account"]; // 필요 경로 추가

function LayoutContent({ children }) {
  const pathname = usePathname();
  const isNoLayoutPage = pathname && noLayoutPaths.includes(pathname);

  return (
    <>
      {!isNoLayoutPage && <Header />}
      <main className={isNoLayoutPage ? "" : "pt-[144px] min-h-screen"}>{children}</main>
      {!isNoLayoutPage && <Footer />}
    </>
  );
}

function LoadingFallback() {
  return (
    <>
      <Header />
      <main className="pt-[144px] min-h-screen">
        <div className="flex items-center justify-center min-h-screen">로딩 중...</div>
      </main>
      <Footer />
    </>
  );
}

export default function ClientLayout({ children }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
