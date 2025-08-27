import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import websocketManager from "../lib/websocketManager";

// Gateway를 통한 정확한 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // 로그인 - Axios 기반으로 통일
      tempLogin: async (loginId, password) => {
        try {
          set({ loading: true, error: null });
          // console.log("로그인 요청 URL:", `${API_BASE_URL}/user-service/auth/login`);

          const response = await axios.post(
            `${API_BASE_URL}/user-service/auth/login`,
            { loginId, password },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );

          // console.log("✅ 로그인 성공:", response.data);
          // response.data.data가 { accessToken, refreshToken, user: {...} } 구조인지 확인
          const userData = response.data.data.user || response.data.data;
          set({
            user: userData,
            isAuthenticated: true,
            loading: false,
          });

          // 로그인 성공 시 WebSocket 연결
          try {
            const userId = userData.id || response.data.data.id;
            await websocketManager.connect(userId, userData);
            console.log("✅ WebSocket 연결 성공");
          } catch (error) {
            console.error("❌ WebSocket 연결 실패:", error);
          }

          return { success: true, data: response.data.data, message: "로그인되었습니다!" };
        } catch (error) {
          console.error("❌ 로그인 실패:", error.response?.data || error.message);
          const errorMessage = error.response?.data?.message || "로그인에 실패했습니다.";
          set({ error: errorMessage, loading: false });
          return { success: false, message: errorMessage };
        }
      },

      // 인증 상태 확인 - Axios 기반으로 통일, 401 Unauthorized 에러 처리
      checkAuthStatus: async () => {
        try {
          set({ loading: true, error: null });
          // console.log("인증 확인 URL:", `${API_BASE_URL}/user-service/users/me`);

          const response = await axios.get(`${API_BASE_URL}/user-service/users/me`, { withCredentials: true });

          // console.log("✅ 인증 확인 성공:", response.data);
          if (response.data.success && response.data.data && response.data.data.id) {
            set({ user: response.data.data, isAuthenticated: true, loading: false });
            return true;
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
            return false;
          }
        } catch (error) {
          // 401 에러는 정상적인 상황 (로그인되지 않은 상태)
          if (error.response?.status === 401) {
            console.log("ℹ️ 사용자가 로그인되지 않은 상태입니다.");
          } else {
            console.error("❌ 인증 확인 중 오류 발생:", error.response?.data || error.message);
          }
          set({ user: null, isAuthenticated: false, loading: false });
          return false;
        }
      },

      // 회원가입 - Axios 기반으로 통일, JSON 파싱으로 코드
      signup: async (signupData) => {
        try {
          set({ loading: true, error: null });
          console.log("회원가입 요청 URL:", `${API_BASE_URL}/user-service/auth/signup`);

          const response = await axios.post(
            `${API_BASE_URL}/user-service/auth/signup`,
            {
              ...signupData,
              isTermsAgreed: signupData.agreements?.terms || false,
              isPrivacyAgreed: signupData.agreements?.privacy || false,
              oauthProvider: "LOCAL",
              role: "USER",
            },
            { withCredentials: true }
          );

          console.log("✅ 회원가입 성공:", response.data);
          // response.data.data가 { accessToken, refreshToken, user: {...} } 구조인지 확인
          const userData = response.data.data.user || response.data.data;
          set({ user: userData, isAuthenticated: true, loading: false });

          return { success: true, data: response.data.data, message: "회원가입이 완료되었습니다!" };
        } catch (error) {
          console.error("❌ 회원가입 실패:", error.response?.data || error.message);
          const errorMessage = error.response?.data?.message || "회원가입에 실패했습니다.";
          set({ error: errorMessage, loading: false });
          return { success: false, message: errorMessage };
        }
      },

      // 로그아웃 - Axios 기반으로 통일, POST 요청 본문을 명시적으로 전달
      logout: async () => {
        try {
          set({ loading: true, error: null });
          await axios.post(
            `${API_BASE_URL}/user-service/auth/logout`,
            {}, // POST 요청 본문
            { withCredentials: true }
          );
          // 로그아웃 시 WebSocket 연결 해제
          websocketManager.disconnect();
          console.log("✅ WebSocket 연결 해제됨");

          set({ user: null, isAuthenticated: false, loading: false });
          return { success: true, message: "로그아웃되었습니다." };
        } catch (error) {
          console.error("로그아웃 에러:", error.response?.data || error.message);

          // 에러가 발생해도 WebSocket 연결은 해제
          websocketManager.disconnect();
          console.log("✅ WebSocket 연결 해제됨");

          set({ user: null, isAuthenticated: false, loading: false });
          return { success: false, message: "로그아웃 중 오류가 발생했지만 로컬 로그아웃되었습니다." };
        }
      },

      // 기타 메서드들
      getDisplayName: () => {
        const { user } = get();
        if (!user) return "게스트";
        return user.nickname || user.name || user.loginId || "사용자";
      },

      isLoggedIn: () => {
        const { isAuthenticated } = get();
        return isAuthenticated;
      },
    }),
    {
      name: "user-storage", // localStorage 키 이름
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // 저장할 상태만 선택
    }
  )
);

// 안전한 선택자들 - 무한 루프 방지 (개별 상태로 분리)
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useUserLoading = () => useUserStore((state) => state.loading);
export const useUserError = () => useUserStore((state) => state.error);

// 개별 액션 훅들 - 안정적인 참조 보장
export const useTempLogin = () => useUserStore((state) => state.tempLogin);
export const useSignup = () => useUserStore((state) => state.signup);
export const useLogout = () => useUserStore((state) => state.logout);
export const useCheckAuthStatus = () => useUserStore((state) => state.checkAuthStatus);
export const useSetLoading = () => useUserStore((state) => state.setLoading);
export const useSetError = () => useUserStore((state) => state.setError);
export const useClearError = () => useUserStore((state) => state.clearError);
export const useGetDisplayName = () => useUserStore((state) => state.getDisplayName);
export const useIsLoggedIn = () => useUserStore((state) => state.isLoggedIn);
