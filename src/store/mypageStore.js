// store/myPageStore.js

import { create } from 'zustand';
import { userAPI, productAPI } from '@/lib/api';

export const useMyPageStore = create((set) => ({
    // 대시보드 섹션
    dashboard: {
        profileInfo: null,
        childrenList: [],
        tradingSummary: null,
        purchasedProducts: [], // 구매 상품 목록
        soldProducts: [],      // 판매 상품 목록
    },

    // 로딩 상태
    loading: {
        dashboard: false,
        purchases: false, // 구매 상품 로딩 상태
        sales: false,     // 판매 상품 로딩 상태
    },
    error: null,

    // 통합 대시보드 정보를 한 번에 가져오는 함수
    getMypageDashboard: async (userId) => {
        set(state => ({ loading: { ...state.loading, dashboard: true }, error: null }));
        try {
            // userAPI 사용 (이미 api.js에 정의되어 있음)
            const response = await userAPI.getMypageDashboard();

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

    // 구매 상품 목록을 가져오는 함수
    getPurchasedProducts: async () => {
        set(state => ({ loading: { ...state.loading, purchases: true }, error: null }));
        try {
            const response = await productAPI.getMyPurchases();
            if (response.data.success) {
                set(state => ({
                    dashboard: {
                        ...state.dashboard,
                        purchasedProducts: response.data.data,
                    },
                    loading: { ...state.loading, purchases: false },
                }));
            } else {
                set(state => ({
                    error: response.data.message,
                    loading: { ...state.loading, purchases: false },
                }));
            }
        } catch (error) {
            console.error('구매 상품 목록 조회 실패:', error.response?.data?.message || error.message);
            set(state => ({
                error: error.response?.data?.message || '구매 상품 목록 조회 실패',
                loading: { ...state.loading, purchases: false },
            }));
        }
    },

    // 판매 상품 목록을 가져오는 함수
    getSoldProducts: async () => {
        set(state => ({ loading: { ...state.loading, sales: true }, error: null }));
        try {
            const response = await productAPI.getMySales();
            if (response.data.success) {
                set(state => ({
                    dashboard: {
                        ...state.dashboard,
                        soldProducts: response.data.data,
                    },
                    loading: { ...state.loading, sales: false },
                }));
            } else {
                set(state => ({
                    error: response.data.message,
                    loading: { ...state.loading, sales: false },
                }));
            }
        } catch (error) {
            console.error('판매 상품 목록 조회 실패:', error.response?.data?.message || error.message);
            set(state => ({
                error: error.response?.data?.message || '판매 상품 목록 조회 실패',
                loading: { ...state.loading, sales: false },
            }));
        }
    },
}));

// 모든 데이터 선택자들
export const useProfileInfo = () => useMyPageStore(state => state.dashboard.profileInfo);
export const useChildrenList = () => useMyPageStore(state => state.dashboard.childrenList);
export const useTradingSummary = () => useMyPageStore(state => state.dashboard.tradingSummary);
export const usePurchasedProducts = () => useMyPageStore(state => state.dashboard.purchasedProducts);
export const useSoldProducts = () => useMyPageStore(state => state.dashboard.soldProducts);

// 로딩/에러 선택자들
export const useMyPageLoading = () => useMyPageStore(state => state.loading);
export const useMyPageError = () => useMyPageStore(state => state.error);

// 액션 선택자들 마지막
export const useGetMypageDashboard = () => useMyPageStore(state => state.getMypageDashboard);
export const useGetPurchasedProducts = () => useMyPageStore(state => state.getPurchasedProducts);
export const useGetSoldProducts = () => useMyPageStore(state => state.getSoldProducts);