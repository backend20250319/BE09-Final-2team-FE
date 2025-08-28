// store/categoryStore.ts
import { create } from 'zustand';
import { productAPI } from '@/lib/api';

export const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        try {
            set({ loading: true, error: null });
            const res = await productAPI.getCategoriesTree();
            console.log('🚀 카테고리 API 응답:', res.data);

            // ✅ 여기서 반드시 categories로 세팅
            set({ categories: res.data || [], loading: false });
        } catch (err) {
            console.error('카테고리 불러오기 실패:', err);
            set({ error: err.message, loading: false });
        }
    },
}));
