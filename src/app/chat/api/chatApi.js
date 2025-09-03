import api from "../../../lib/api";

// Gateway를 통한 정확한 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// 채팅 관련 API
export const chatApi = {
  // 내가 참여한 채팅방 목록 조회
  getMyRooms: () => api.get("/chat-service/rooms/me"),

  // 채팅방 생성 (또는 기존 방 반환)
  createRoom: (data) => api.post("/chat-service/rooms", data),

  // 채팅방 참여자 목록 조회
  getRoomParticipants: (roomId) => api.get(`/chat-service/rooms/${roomId}/participants`),

  // 채팅방 멤버십 확인
  checkMembership: (roomId, userId) => api.get(`/chat-service/rooms/${roomId}/members/${userId}`),

  // 채팅 메시지 목록 조회
  getMessages: (roomId, page = 0, size = 20) =>
    api.get(`/chat-service/rooms/${roomId}/messages?page=${page}&size=${size}`),

  // 메시지 전송
  sendMessage: (roomId, data) => api.post(`/chat-service/rooms/${roomId}/messages`, data),

  // 메시지 전송 시 자동 채팅방 생성
  sendMessageWithAutoRoom: (data) => api.post(`/chat-service/rooms/0/messages/send-with-room`, data),

  /*
  // 메시지 읽음 처리
  markAsRead: (roomId, data) => api.post(`/chat-service/rooms/${roomId}/messages/read`, data),
  */

  // 읽지 않은 메시지 수 조회
  getUnreadCount: (roomId) => api.get(`/chat-service/unread/${roomId}`),
};

// 하위 호환성을 위한 별칭
export const chatAPI = chatApi;
