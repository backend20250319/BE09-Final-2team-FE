import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { TradeStatus } from "@/enums/tradeStatus";

// 환경변수에서 API URL 가져오기
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
const USER_API_URL =
  process.env.NEXT_PUBLIC_USER_API_URL || `${API_BASE_URL}/user-service`;
const PRODUCT_URL = `/product-service`;
const POST_URL = "/post-service";

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
    // localStorage에서 직접 토큰 가져오기
    const userStorage = localStorage.getItem("user-storage");
    let token = null;
    if (userStorage) {
      try {
        const parsed = JSON.parse(userStorage);
        token = parsed.state?.accessToken;
      } catch (e) {
        console.error("localStorage 파싱 실패:", e);
      }
    }

    // 디버깅
    console.log("API 요청 토큰:", token ? "존재함" : "없음");
    console.log("요청 URL:", config.url);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("액세스 토큰이 없습니다");
    }

    return config;
  },
  (error) => {
    console.error("요청 인터셉터 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// File Service API 함수들
export const fileAPI = {
  // 파일 업로드
  upload: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("imageFiles", file));

    return api.post("/file-service/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// User Service API 함수들
export const userAPI = {
  // 인증 관련
  signup: (data) => api.post("/user-service/auth/signup", data),
  login: (data) => api.post("/user-service/auth/login", data),
  logout: (userId) =>
    api.post(
      `${USER_API_URL}/auth/logout`,
      {},
      { headers: { "X-User-Id": userId } }
    ),
  refresh: () => api.post("/user-service/auth/refresh"),
  validateToken: (token) => api.post("/user-service/auth/validate", { token }),
  validateTokenFromCookie: () => api.post("/user-service/auth/validate-cookie"),

  // 대시보드 정보 조회
  getDashboardData: () => api.get("/user-service/users/me/dashboard"),
  getMypageDashboard: () => api.get("/user-service/users/me/dashboard"),

  // 상품 관련
  getPurchasedProducts: () =>
    api.get("/user-service/users/me/products/purchased"),
  getSoldProducts: () => api.get("/user-service/users/me/products/sold"),

  // 프로필 관리
  getProfileForEdit: () => api.get("/user-service/users/me/profile"),
  updateProfile: (data) => api.put("/user-service/users/profile", data),
  changePassword: (data) => api.put("/user-service/users/password", data),
  deleteAccount: (data) => api.delete("/user-service/users/account", { data }),

  // 사용자 정보 조회
  getUserInfo: (userId) => api.get(`/user-service/users/${userId}`),
  getOtherUserProfile: (userId) =>
    api.get(`/user-service/users/${userId}/profile-page`),

  // 거래 지역 관리
  searchTradeLocations: (keyword) =>
    api.get(
      `/user-service/users/search-areas?keyword=${encodeURIComponent(keyword)}`
    ),
  updateTradeLocations: (data) =>
    api.put("/user-service/users/me/trade-locations", data),
  getMyTradeLocations: (userId) =>
    api.get(`/user-service/users/${userId}/my-trade-locations`),

  // 중복 확인
  checkDuplicate: (type, value) =>
    api.get(
      `/user-service/users/check?type=${type}&value=${encodeURIComponent(
        value
      )}`
    ),

  // 다른 서비스용
  getBasicInfo: (userId) => api.get(`/user-service/users/${userId}/basic`),
  checkUserExists: (userId) => api.get(`/user-service/users/${userId}/exists`),
};

// Product Service API 함수들
export const productAPI = {
  // 카테고리 트리 조회
  getCategoriesTree: () => api.get("/product-service/categories/tree"),

  // 주소 검색 (emd = 읍/면/동 이름)
  searchAreas: (emd) =>
    api.get("/product-service/areas/search", { params: { emd } }),

  // 내 거래 요약 조회
  getMyTradeSummary: () => api.get("/product-service/trades/me/summary"),

  // 특정 유저 거래 요약 조회
  getUserTradeSummary: (userId) =>
    api.get(`/product-service/trades/users/${userId}/summary`),

  // 내 구매 상품 조회
  getMyPurchases: () => api.get("/product-service/trades/me/purchases"),

  // 내 판매 상품 조회
  getMySales: () => api.get("/product-service/trades/me/sales"),

  // 타 유저 상품 조회
  getUserSales: (sellerId) =>
    api.get(`/product-service/trades/users/${sellerId}/sales`),

  // 판매완료 처리
  completeTrade: (productId, buyerId) =>
    api.patch(`/product-service/trades/${productId}/complete`, { buyerId }),

  // 상품 거래 상태 수정
  updateTradeStatus: (productId, newStatus) => {
    if (!Object.values(TradeStatus).includes(newStatus)) {
      throw new Error(`잘못된 거래 상태 값: ${newStatus}`);
    }
    return api.patch(`/product-service/trades/${productId}/status`, {
      newStatus,
    });
  },

  // 상품 등록
  createProduct: (productData) =>
    api.post("/product-service/products", productData),

  // 상품 상세 조회
  getProductDetail: (productId) =>
    api.get(`/product-service/products/${productId}`),

  // 상품 요약 리스트 조회
  getProductsSummary: (productIds) =>
    api.get(
      `/product-service/products/summary?productIds=${productIds.join(",")}`
    ),

  // 홈 상품 섹션 조회
  getHomeSections: () => api.get("/product-service/products/sections"),

  // 상품 검색
  searchProducts: (searchRequest) =>
    api.post("/product-service/products/search", searchRequest),

  // 찜하기
  addWishlist: (productId) =>
    api.post(`/product-service/products/${productId}/wishlist`),

  // 찜취소
  removeWishlist: (productId) =>
    api.delete(`/product-service/products/${productId}/wishlist`),

  // 내 찜한 상품 조회
  getMyWishlist: () => api.get("/product-service/products/me/wishlist"),

  // 유사 상품 리스트 조회
  getSimilarProducts: (keyword) =>
    api.get(`/product-service/products/similar`, {
      params: { keyword },
    }),
};

// Post Service Api 함수들
export const postAPI = {
  /** 생성 (멀티파트) - 컨트롤러가 /posts 에서 파일 파트 유연하게 처리 */
  createPostMultipart: ({ title, contentHtml, categoryName, files = [] }) => {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("contentHtml", contentHtml);
    fd.append("categoryName", categoryName);
    files.forEach((f) => fd.append("imageFiles", f)); // 우리쪽 전송 키는 imageFiles로 통일

    return api.post(`${POST_URL}/posts`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  //  /** 목록 조회 (category, page, size, sort 등 params) → Page<PostResponseDto> */
  getPosts: (params) =>
    api.get(`${POST_URL}/posts`, {
      params: { category: params.category },
    }),

  /** 단건 조회 (컨트롤러: ApiResponse<{ post, comments, like }>) */
  getPost: (postId) => api.get(`${POST_URL}/posts/${postId}`),

  /** 삭제 */
  deletePost: (postId) => api.delete(`${POST_URL}/posts/${postId}`),
};

export default api;
