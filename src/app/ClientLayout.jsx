"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCheckAuthStatusSilently, useIsAuthenticated, useUser } from "@/store/userStore";
import { useCategoryStore } from "@/store/categoryStore"; // CategoryStore
import websocketManager from "@/lib/websocketManager";
import Loading from "./loading/loading";

const noLayoutPaths = ["/login", "/signup", "/signup/complete", "/additional-info", "/find-account"]; // 필요 경로 추가

function LayoutContent({ children }) {
  const pathname = usePathname();
  const isNoLayoutPage = pathname && noLayoutPaths.includes(pathname);
  const checkAuthStatusSilently = useCheckAuthStatusSilently();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const [authChecked, setAuthChecked] = useState(false);

  // 카테고리 스토어
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);

  // 앱 시작 시 카테고리 데이터 로드
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 전역 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      // 이미 인증 상태가 확인되었거나 로그인/회원가입 페이지인 경우 스킵
      if (authChecked || isNoLayoutPage) {
        return;
      }

      try {
        await checkAuthStatusSilently(); // 변경 - 401 에러 없이 조용히 확인
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
  }, [checkAuthStatusSilently, isNoLayoutPage, authChecked]);

  // 인증된 사용자가 있을 때 WebSocket 연결 확인
  useEffect(() => {
    if (isAuthenticated && user?.id && authChecked) {
      const checkWebSocketConnection = async () => {
        const status = websocketManager.getConnectionStatus();

        // WebSocket이 연결되지 않은 경우 연결 시도
        if (!status.isConnected) {
          try {
            await websocketManager.connect(user.id, user);
          } catch (error) {
            console.error("ClientLayout WebSocket 연결 실패:", error);
          }
        }
      };

      checkWebSocketConnection();
    }
  }, [isAuthenticated, user, authChecked]);

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
        {/* <div className="flex items-center justify-center min-h-screen">로딩 중...</div> */}
        <Loading />
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
