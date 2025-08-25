// store/myPageStore.js

import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000";

export const useMyPageStore = create((set) => ({
    // 대시보드 섹션
    dashboard: {
        profileInfo: null,
        childrenList: [],
        tradingSummary: null,
    },

    // 로딩 상태
    loading: {
        profile: false,
        children: false,
        trading: false,
    },

    error: null,

    // --- 프로필 정보 조회 ---
    fetchProfileInfo: async () => {
        set(state => ({ loading: { ...state.loading, profile: true }, error: null }));
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/user-service/users/me`,
                { withCredentials: true }
            );
            if (response.data.success) {
                set(state => ({
                    dashboard: { ...state.dashboard, profileInfo: response.data.data },
                    loading: { ...state.loading, profile: false },
                }));
            }
        } catch (error) {
            console.error('프로필 조회 실패:', error);
            set(state => ({
                error: error.response?.data?.message || '프로필 조회 실패',
                loading: { ...state.loading, profile: false },
            }));
        }
    },

    // --- 자녀 목록 조회 ---
    fetchChildrenList: async () => {
        set(state => ({ loading: { ...state.loading, children: true }, error: null }));
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/user-service/children/me`,
                { withCredentials: true }
            );
            if (response.data.success) {
                set(state => ({
                    dashboard: { ...state.dashboard, childrenList: response.data.data },
                    loading: { ...state.loading, children: false },
                }));
            }
        } catch (error) {
            console.error('자녀 목록 조회 실패:', error);
            set(state => ({
                error: error.response?.data?.message || '자녀 목록 조회 실패',
                loading: { ...state.loading, children: false },
            }));
        }
    },

    // --- 거래 요약 조회 ---
    fetchTradingSummary: async () => {
        set(state => ({ loading: { ...state.loading, trading: true }, error: null }));
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/trading-service/summary`, // 예시 URL
                { withCredentials: true }
            );
            if (response.data.success) {
                set(state => ({
                    dashboard: { ...state.dashboard, tradingSummary: response.data.data },
                    loading: { ...state.loading, trading: false },
                }));
            }
        } catch (error) {
            console.error('거래 요약 조회 실패:', error);
            set(state => ({
                error: error.response?.data?.message || '거래 요약 조회 실패',
                loading: { ...state.loading, trading: false },
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
export const useFetchProfileInfo = () => useMyPageStore(state => state.fetchProfileInfo);
export const useFetchChildrenList = () => useMyPageStore(state => state.fetchChildrenList);
export const useFetchTradingSummary = () => useMyPageStore(state => state.fetchTradingSummary);