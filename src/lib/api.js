import axios from "axios";
import { useUserStore } from "@/store/userStore";

// 환경변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || `${API_BASE_URL}/chat-service`;
const USER_API_URL = process.env.NEXT_PUBLIC_USER_API_URL || `${API_BASE_URL}/user-service`;

// axios 기본 설정 (쿠키 기반 인증)
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 지원
});

// 요청 인터셉터 - accessToken 자동 주입
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken; // zustand에서 토큰 가져오기
    console.log("token: ", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// User Service API 함수들
export const userAPI = {
  // 인증 관련
  signup: (data) => api.post("/user-service/auth/signup", data),
  login: (data) => api.post("/user-service/auth/login", data),
  logout: () => api.post("/user-service/auth/logout"),
  refresh: () => api.post("/user-service/auth/refresh"),

  // 사용자 정보
  getMyInfo: () => api.get("/user-service/users/me"),
  getUserInfo: (userId) => api.get(`/user-service/users/${userId}`),
  getProfileForEdit: () => api.get("/user-service/users/me/profile"),
  updateProfile: (data) => api.put("/user-service/users/profile", data),

  // 계정 관리
  changePassword: (data) => api.put("/user-service/users/password", data),
  deleteAccount: (data) => api.delete("/user-service/users/account", { data }),
  checkDuplicate: (type, value) => api.get(`/user-service/users/check?type=${type}&value=${encodeURIComponent(value)}`),

  // 다른 서비스용
  getBasicInfo: (userId) => api.get(`/user-service/users/${userId}/basic`),
  checkUserExists: (userId) => api.get(`/user-service/users/${userId}/exists`),
};

// Product Service API 함수들
export const productAPI = {
  // 상품 목록 조회
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    return api.get(`/product-service/products?${queryParams.toString()}`);
  },

  // 상품 상세 조회
  getProduct: (productId) => api.get(`/product-service/products/${productId}`),

  // 상품 요약 정보 조회 (여러 상품 ID로 한 번에 조회)
  getProductsSummary: (productIds) => {
    const ids = Array.isArray(productIds) ? productIds.join(",") : productIds;
    return api.get(`/product-service/products/summary?productIds=${ids}`);
  },

  // 상품 등록
  createProduct: (data) => api.post("/product-service/products", data),

  // 상품 수정
  updateProduct: (productId, data) => api.put(`/product-service/products/${productId}`, data),

  // 상품 삭제
  deleteProduct: (productId) => api.delete(`/product-service/products/${productId}`),

  // 내 상품 목록
  getMyProducts: (userId) => api.get(`/product-service/products/my/${userId}`),

  // 카테고리별 상품 조회
  getProductsByCategory: (categoryId) => api.get(`/product-service/products/category/${categoryId}`),

  // 상품 검색
  searchProducts: (keyword) => api.get(`/product-service/products/search?keyword=${encodeURIComponent(keyword)}`),
};

export default api;
