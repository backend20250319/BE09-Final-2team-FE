// store/myPageStore.js

import { create } from 'zustand';
import { userAPI } from '@/lib/api';

export const useMyPageStore = create((set) => ({
    // 대시보드 섹션
    dashboard: {
        profileInfo: null,
        childrenList: [],
        tradingSummary: null,
    },

    // 로딩 상태
    loading: { dashboard: false },
    error: null,

    // 통합 대시보드 정보를 한 번에 가져오는 함수
    getMypageDashboard: async (userId) => {
        set(state => ({ loading: { ...state.loading, dashboard: true }, error: null }));
        try {
            if (!userId) {
                console.error('사용자 ID가 없습니다.');
                set(state => ({
                    error: '사용자 ID가 없습니다.',
                    loading: { ...state.loading, dashboard: false },
                }));
                return;
            }

            // userAPI 사용 (이미 api.js에 정의되어 있음)
            const response = await userAPI.getMypageDashboard();
            console.log('백엔드 응답 원본:', response.data);

            if (response.data.success) {
                const { profileInfo, childList, transactionSummary } = response.data.data;
                set(state => ({
                    dashboard: {
                        ...state.dashboard,
                        profileInfo,
                        childrenList: childList,
                        tradingSummary: transactionSummary,
                    },
                    loading: { ...state.loading, dashboard: false },
                }));
            } else {
                set(state => ({
                    error: response.data.message,
                    loading: { ...state.loading, dashboard: false },
                }));
            }
        } catch (error) {
            console.error('대시보드 정보 조회 실패:', error.response?.data?.message || error.message);
            set(state => ({
                error: error.response?.data?.message || '대시보드 정보 조회 실패',
                loading: { ...state.loading, dashboard: false },
            }));
        }
    },
}));

// 선택자들
export const useProfileInfo = () => useMyPageStore(state => state.dashboard.profileInfo);
export const useChildrenList = () => useMyPageStore(state => state.dashboard.childrenList);
export const useTradingSummary = () => useMyPageStore(state => state.dashboard.tradingSummary);
export const useMyPageLoading = () => useMyPageStore(state => state.loading);
export const useMyPageError = () => useMyPageStore(state => state.error);
export const useGetMypageDashboard = () => useMyPageStore(state => state.getMypageDashboard);