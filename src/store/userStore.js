import { create } from "zustand";
import axios from "axios";

// 🔥 Gateway를 통한 정확한 URL
const API_BASE_URL = "http://localhost:8000";

export const useUserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  tempLogin: async (loginId, password) => {
    try {
      set({ loading: true, error: null });
      console.log(
        "로그인 요청 URL:",
        `${API_BASE_URL}/api/v1/user-service/auth/login`
      );

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user-service/auth/login`,
        { loginId, password },
        {
          withCredentials: true, // 쿠키 설정을 위해 필요
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("응답 상태:", response.status);

      if (response.status === 200 && response.data.success) {
        console.log("✅ 로그인 성공:", response.data);

        // 사용자 정보와 인증 상태 설정
        set({
          user: response.data.data,
          isAuthenticated: true,
          loading: false,
        });

        return true;
      }
    } catch (error) {
      console.log("❌ 로그인 실패:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "로그인 실패",
        loading: false,
      });
      return false;
    }
  },

  // 인증 상태 확인 - Gateway 경로 사용
  checkAuthStatus: async () => {
    const { setLoading } = get(); // 🔥 추가
    setLoading(true); // 🔥 추가

    try {
      console.log(
        "🔍 인증 확인 URL:",
        `${API_BASE_URL}/api/v1/user-service/users/me`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/v1/user-service/users/me`,
        {
          credentials: "include",
        }
      );

      console.log("📡 인증 확인 응답 상태:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ 인증 확인 성공 - 전체 응답:", result);
        console.log("✅ 인증 확인 user 데이터:", result.data);

        // 🔥 핵심 수정: result.data를 직접 확인
        if (result.data && result.data.id) {
          set({
            user: result.data, // 🔥 이 부분이 제대로 설정되는지 확인
            isAuthenticated: true,
            loading: false, // 🔥 추가
            error: null,
          });

          console.log("🔥 상태 업데이트 완료 - user:", result.data);
          return true;
        } else {
          console.log("❌ result.data가 비어있음:", result);
          set({
            user: null,
            isAuthenticated: false,
            loading: false, // 🔥 추가
            error: null,
          });
          return false;
        }
      } else {
        console.log("❌ 인증 확인 실패 - 로그인 필요");
        set({
          user: null,
          isAuthenticated: false,
          loading: false, // 🔥 추가
          error: null,
        });
        return false;
      }
    } catch (error) {
      console.error("🔥 인증 확인 네트워크 에러:", error);
      set({
        user: null,
        isAuthenticated: false,
        loading: false, // 🔥 추가
        error: null,
      });
      return false;
    }
  },

  // 회원가입 - Gateway 경로 사용
  signup: async (signupData) => {
    const { setLoading, setError, clearError } = get();

    setLoading(true);
    clearError();

    try {
      console.log(
        "🚀 회원가입 요청 URL:",
        `${API_BASE_URL}/api/v1/user-service/auth/signup`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/v1/user-service/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            loginId: signupData.loginId,
            password: signupData.password,
            name: signupData.name,
            email: signupData.email,
            phoneNumber: signupData.phone,
            nickname: signupData.nickname || null,
            address: signupData.address,
            isTermsAgreed: signupData.agreements?.terms || false,
            isPrivacyAgreed: signupData.agreements?.privacy || false,
            oauthProvider: "LOCAL",
            role: "USER",
          }),
        }
      );

      console.log("📡 회원가입 응답 상태:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ 회원가입 성공:", result);

        set({
          user: result.data,
          isAuthenticated: true,
          loading: false,
          error: null,
        });

        return {
          success: true,
          data: result.data,
          message: "회원가입이 완료되었습니다!",
        };
      } else {
        const error = await response.json();
        console.log("❌ 회원가입 실패:", error);
        const errorMessage = error.message || "회원가입에 실패했습니다.";

        setError(errorMessage);
        setLoading(false);

        return {
          success: false,
          message: errorMessage,
        };
      }
    } catch (error) {
      console.error("🔥 회원가입 네트워크 에러:", error);
      const errorMessage = "네트워크 오류가 발생했습니다.";

      setError(errorMessage);
      setLoading(false);

      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  // 로그아웃
  logout: async () => {
    const { setLoading } = get();
    setLoading(true);

    try {
      await fetch(`${API_BASE_URL}/api/v1/user-service/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      return {
        success: true,
        message: "로그아웃되었습니다.",
      };
    } catch (error) {
      console.error("로그아웃 에러:", error);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      return {
        success: false,
        message: "로그아웃 중 오류가 발생했지만 로컬 로그아웃되었습니다.",
      };
    }
  },

  // 기타 메서드들...
  getDisplayName: () => {
    const { user } = get();
    if (!user) return "게스트";
    return user.nickname || user.name || user.loginId || "사용자";
  },

  isLoggedIn: () => {
    const { isAuthenticated } = get();
    return isAuthenticated;
  },
}));

// 안전한 선택자들 - 무한 루프 방지 (개별 상태로 분리)
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () =>
  useUserStore((state) => state.isAuthenticated);
export const useUserLoading = () => useUserStore((state) => state.loading);
export const useUserError = () => useUserStore((state) => state.error);

// 호환성을 위한 복합 훅 (사용 지양)
export const useUserState = () => {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);

  return { user, isAuthenticated, loading, error };
};

// 개별 액션 훅들 - 안정적인 참조 보장 (핵심!)
export const useTempLogin = () => useUserStore((state) => state.tempLogin);
export const useSignup = () => useUserStore((state) => state.signup);
export const useLogout = () => useUserStore((state) => state.logout);
export const useCheckAuthStatus = () =>
  useUserStore((state) => state.checkAuthStatus);
export const useSetLoading = () => useUserStore((state) => state.setLoading);
export const useSetError = () => useUserStore((state) => state.setError);
export const useClearError = () => useUserStore((state) => state.clearError);
export const useGetDisplayName = () =>
  useUserStore((state) => state.getDisplayName);
export const useIsLoggedIn = () => useUserStore((state) => state.isLoggedIn);

// 레거시 호환성을 위한 훅 (무한 루프 위험 - 사용 지양)
export const useUserActions = () =>
  useUserStore((state) => ({
    tempLogin: state.tempLogin,
    signup: state.signup,
    logout: state.logout,
    checkAuthStatus: state.checkAuthStatus,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
  }));

export const useUserUtils = () =>
  useUserStore((state) => ({
    getDisplayName: state.getDisplayName,
    isLoggedIn: state.isLoggedIn,
  }));
