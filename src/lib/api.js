import axios from "axios";

// axios 기본 설정 (하이브리드 방식: 쿠키 + 토큰)
const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // 쿠키 지원 (User Service용)
});

// 요청 인터셉터 - 토큰 방식 유지
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

// User Service API 함수들
export const userAPI = {
    // 인증 관련
    signup: (data) => api.post('/user-service/auth/signup', data),
    login: (data) => api.post('/user-service/auth/login', data),
    logout: () => api.post('/user-service/auth/logout'),
    refresh: () => api.post('/user-service/auth/refresh'),

    // 사용자 정보
    getMyInfo: () => api.get('/user-service/users/me'),
    getUserInfo: (userId) => api.get(`/user-service/users/${userId}`),
    getProfileForEdit: () => api.get('/user-service/users/me/profile'),
    updateProfile: (data) => api.put('/user-service/users/profile', data),

    // 계정 관리
    changePassword: (data) => api.put('/user-service/users/password', data),
    deleteAccount: (data) => api.delete('/user-service/users/account', { data }),
    checkDuplicate: (type, value) => api.get(`/user-service/users/check?type=${type}&value=${encodeURIComponent(value)}`),

    // 다른 서비스용
    getBasicInfo: (userId) => api.get(`/user-service/users/${userId}/basic`),
    checkUserExists: (userId) => api.get(`/user-service/users/${userId}/exists`),
};

export default api;