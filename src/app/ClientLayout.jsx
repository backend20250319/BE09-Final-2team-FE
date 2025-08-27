// app/ClientLayout.jsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCheckAuthStatus, useIsAuthenticated } from "@/store/userStore";

const noLayoutPaths = ["/login", "/signup", "/signup/complete", "/additional-info", "/find-account"]; // 필요 경로 추가

function LayoutContent({ children }) {
  const pathname = usePathname();
  const isNoLayoutPage = pathname && noLayoutPaths.includes(pathname);
  const checkAuthStatus = useCheckAuthStatus();
  const isAuthenticated = useIsAuthenticated();
  const [authChecked, setAuthChecked] = useState(false);

  // 전역 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      // 이미 인증 상태가 확인되었거나 로그인/회원가입 페이지인 경우 스킵
      if (authChecked || isNoLayoutPage) {
        return;
      }

      try {
        await checkAuthStatus();
        setAuthChecked(true);
      } catch (error) {
        console.error("전역 인증 체크 에러:", error);
        setAuthChecked(true);
      }
    };

    // 로그인/회원가입 페이지가 아닐 때만 인증 상태 확인
    if (!isNoLayoutPage) {
      initAuth();
    } else {
      setAuthChecked(true);
    }
  }, [checkAuthStatus, isNoLayoutPage, authChecked]);

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
