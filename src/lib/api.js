import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { TradeStatus } from "@/enums/tradeStatus";

// 환경변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || `${API_BASE_URL}/chat-service`;
const USER_API_URL = process.env.NEXT_PUBLIC_USER_API_URL || `${API_BASE_URL}/user-service`;
const PRODUCT_URL = `/product-service`;

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
  // 카테고리 트리 조회
  getCategoriesTree: () => api.get("product-service/categories/tree"),

  // 주소 검색 (emd = 읍/면/동 이름)
  searchAreas: (emd) => api.get(`/product-service/areas/search`, { params: { emd } }),

  // ✅ 내 거래 요약 조회
  getMyTradeSummary: () => api.get("/product-service/trades/me/summary"),

  // 특정 유저 거래 요약 조회
  getUserTradeSummary: (userId) => api.get(`/product-service/trades/users/${userId}/summary`),

  // ✅ 내 구매 상품 조회
  getMyPurchases: () => api.get("/product-service/trades/me/purchases"),

  // ✅ 내 판매 상품 조회
  getMySales: () => api.get("/product-service/trades/me/sales"),

  // 타 유저 상품 조회
  getUserSales: (sellerId) => api.get(`/product-service/trades/users/${sellerId}/sales`),

  // ✅ 판매완료 처리
  completeTrade: (productId, buyerId) => api.patch(`/product-service/trades/${productId}/complete`, { buyerId }),

  // ✅ 상품 거래 상태 수정
  updateTradeStatus: (productId, newStatus) => {
    if (!Object.values(TradeStatus).includes(newStatus)) {
      throw new Error(`❌ 잘못된 거래 상태 값: ${newStatus}`);
    }
    return api.patch(`/product-service/trades/${productId}/status`, { newStatus });
  },

  // ✅ 상품 등록
  createProduct: (productData) => api.post("/product-service/products", productData),

  // 상품 상세 조회
  getProductDetail: (productId) => api.get(`/product-service/products/${productId}`),

  // 상품 요약 리스트 조회
  getProductsSummary: (productIds) => api.get(`/product-service/products/summary?productIds=${productIds.join(",")}`),

  // 홈 상품 섹션 조회
  getHomeSections: () => api.get("/product-service/products/sections"),

  // 상품 검색
  searchProducts: (searchRequest) => api.post("/product-service/products/search", searchRequest),
};

export default api;
