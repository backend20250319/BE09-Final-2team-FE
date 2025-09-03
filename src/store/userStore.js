import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import websocketManager from '../lib/websocketManager';
import {userAPI} from "@/lib/api";

// Gateway를 통한 정확한 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false, // 초기값 명시
            isAuthReady: false,
            loading: false,
            error: null,

            // 로그인 - Axios 기반으로 통일
            tempLogin: async (loginData) => {
                try {
                    // 1. 로그인 API 호출
                    const response = await userAPI.login(loginData);
                    // 2. 응답 데이터에서 필요한 정보 추출
                    // 백엔드 응답이 { data: { user, accessToken, refreshToken } } 구조이므로
                    const { user, accessToken, refreshToken } = response.data.data;

                    // 3. 상태 업데이트
                    set({
                        user: user,
                        accessToken: accessToken, // 응답에서 받은 토큰을 상태에 저장
                        refreshToken: refreshToken,
                        isAuthenticated: true, // 로그인 성공 시 즉시 true 로 설정
                        isAuthReady: true,
                        loading: false,
                        error: null,
                    });

                    console.log('로그인 성공');

                    return true;
                } catch (error) {
                    console.error('로그인 실패:', error);
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isAuthReady: true
                    });
                    return false;
                }
            },

            // 선택적 인증 확인
            checkAuthStatusSilently: async () => {
                const { accessToken } = get();
                if (!accessToken) {
                    // 토큰이 없으면 API 호출하지 않고 바로 false 리턴 (에러 없음)
                    set({ isAuthenticated: false, isAuthReady: true, loading: false });
                    return false;
                }

                // 토큰이 있을 때만 실제 인증 확인
                return await get().checkAuthStatus();
            },

            // 인증 상태 확인 - Axios 기반으로 통일, 401 Unauthorized 에러 처리
            checkAuthStatus: async () => {
                const { accessToken } = get(); // 현재 상태에서 토큰 가져오기
                if (accessToken) {
                    // 이미 토큰이 있으면 API 호출 없이 인증 상태를 유지
                    console.log("액세스 토큰이 존재하여 인증 상태를 유지합니다.");
                    set({ isAuthenticated: true, isAuthReady: true, loading: false });
                    return true;
                }

                try {
                    set({ loading: true, error: null });

                    // userAPI.getDashboardData()를 사용하도록 수정
                    const response = await userAPI.getDashboardData();
                    const dashboard = response.data?.data;
                    const profile = dashboard?.profileInfo;

                    if (profile?.id) {
                        set({ user: profile, isAuthenticated: true, loading: false, error: null });
                        console.log("인증 확인 성공:", profile.id);
                        return true;
                    } else {
                        set({ user: null, isAuthenticated: false, loading: false, error: '인증 실패' });
                        return false;
                    }
                } catch (error) {
                    // 401 에러는 정상적인 상황 (로그인되지 않은 상태)
                    if (error.response?.status === 401) {
                        console.log('사용자가 로그인되지 않은 상태입니다.');
                    } else {
                        console.error('인증 확인 중 오류 발생:', error.response?.data || error.message);
                    }
                    set({ user: null, isAuthenticated: false, loading: false });
                    return false;
                }
            },

            // 회원가입 - Axios 기반으로 통일, JSON 파싱으로 코드
            signup: async (signupData) => {
                try {
                    set({ loading: true, error: null });
                    console.log('회원가입 요청 URL:', `${API_BASE_URL}/user-service/auth/signup`);

                    const response = await axios.post(
                        `${API_BASE_URL}/user-service/auth/signup`,
                        {
                            ...signupData,
                            isTermsAgreed: signupData.agreements?.terms || false,
                            isPrivacyAgreed: signupData.agreements?.privacy || false,
                            oauthProvider: 'LOCAL',
                            role: 'USER',
                        },
                        { withCredentials: true }
                    );

                    console.log('회원가입 성공:', response.data);
                    // response.data.data가 { accessToken, refreshToken, user: {...} } 구조인지 확인
                    const userData = response.data.data.user || response.data.data;
                    set({ user: userData, isAuthenticated: true, loading: false });

                    return { success: true, data: response.data.data, message: '회원가입이 완료되었습니다!' };
                } catch (error) {
                    console.error('회원가입 실패:', error.response?.data || error.message);
                    const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
                    set({ error: errorMessage, loading: false });
                    return { success: false, message: errorMessage };
                }
            },

            // 로그아웃 - Axios 기반으로 통일, POST 요청 본문을 명시적으로 전달
            logout: async () => {
                // 로컬 상태를 정리하는 별도의 함수
                const clearLocalState = () => {
                    websocketManager.disconnect();
                    console.log('WebSocket 연결 해제됨');
                    localStorage.removeItem('user-storage');
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isAuthReady: true,
                        loading: false,
                        error: null
                    });
                    console.log('로컬 로그아웃 완료');
                    // 여기에 리다이렉트 추가
                    if (typeof window !== 'undefined') {
                        window.location.replace('/'); //replace 사용하면 뒤로가기 불가
                    }
                };

                try {
                    set({ loading: true, error: null });
                    const currentUser = get().user;
                    console.log('로그아웃 시도 - 사용자:', currentUser?.id);

                    // userAPI의 logout 함수를 사용하도록 수정
                    const response = await userAPI.logout(currentUser?.id);

                    // API 요청이 성공(200 OK)하거나, 백엔드 응답이 성공(success: true)일 때
                    if (response.status === 200 || response.data?.success) {
                        console.log('백엔드 로그아웃 성공');
                        clearLocalState();
                        return { success: true, message: '로그아웃되었습니다.' };
                    } else {
                        // 성공 응답이지만 데이터에 문제가 있을 때
                        console.error('API 응답은 성공적이었으나, 데이터에 문제가 있음:', response.data);
                        return { success: false, message: '로그아웃 실패: 유효하지 않은 응답' };
                    }

                } catch (error) {
                    // API 호출 자체에 실패했을 때
                    const status = error.response?.status;
                    const errorMessage = error.response?.data?.message || error.message;
                    console.error('로그아웃 실패:', errorMessage, '상태 코드:', status);

                    // 401(Unauthorized) 또는 403(Forbidden) 에러는 이미 인증 정보가 없다는 뜻이므로 로컬 상태 정리
                    if (status === 401 || status === 403) {
                        console.log('인증 정보가 유효하지 않아 로컬 상태를 정리합니다.');
                        clearLocalState();
                        return { success: true, message: '로그아웃되었습니다.' };
                    } else {
                        // 그 외의 에러(네트워크 문제 등)는 상태를 유지
                        set({ loading: false, error: errorMessage });
                        return { success: false, message: `로그아웃 중 오류가 발생했습니다: ${errorMessage}` };
                    }
                }
            },

            // 기타 메서드들
            getDisplayName: () => {
                const { user } = get();
                if (!user) return '게스트';
                return user.nickname || user.name || user.loginId || '사용자';
            },

            isLoggedIn: () => {
                const { isAuthenticated } = get();
                return isAuthenticated;
            },
        }),
        {
            name: 'user-storage', // localStorage 키 이름
            partialize: (state) => {
                console.log('partialize 실행:', {
                    isAuthenticated: state.isAuthenticated,
                    hasUser: !!state.user,
                    hasAccessToken: !!state.accessToken
                });

                if (state.isAuthenticated && state.user && state.accessToken) {
                    return {
                        user: state.user,
                        accessToken: state.accessToken,
                        refreshToken: state.refreshToken,
                        isAuthenticated: state.isAuthenticated,
                    };
                }
                return {}; // 빈 객체라도 반환
            },

            // 복원 시 로그 추가
            onRehydrateStorage: () => {
                console.log('userStore 복원 시작');

                // 콜백 함수를 반환(복원 완료 후 실행됨)
                return (state, error) => {
                    if (error) {
                        console.error('userStore 복원 실패:', error);
                    } else {
                        // 복원 성공 시 - 실제 복원된 데이터 확인
                        console.log('userStore 복원 성공:', {
                            hasUser: !!state?.user,                 // 사용자 정보가 있는지 확인
                            hasToken: !!state?.accessToken,         // 토큰이 있는지
                            isAuthenticated: state?.isAuthenticated // 인증 상태는?
                        });
                    }
                };
            }
        }
    )
);

// 선택자들
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useUserLoading = () => useUserStore((state) => state.loading);
export const useUserError = () => useUserStore((state) => state.error);

// 액션 훅들
export const useTempLogin = () => useUserStore((state) => state.tempLogin);
export const useSignup = () => useUserStore((state) => state.signup);
export const useLogout = () => useUserStore((state) => state.logout);
export const useCheckAuthStatus = () => useUserStore((state) => state.checkAuthStatus);
export const useGetDisplayName = () => useUserStore((state) => state.getDisplayName);
export const useIsLoggedIn = () => useUserStore((state) => state.isLoggedIn);
export const useCheckAuthStatusSilently = () => useUserStore((state) => state.checkAuthStatusSilently);