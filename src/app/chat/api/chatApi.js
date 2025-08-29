// Chat Service API 함수들
export const chatAPI = {
  // 채팅방 관련
  createRoom: (data) => api.post("/chat-service/rooms", data),
  getMyRooms: (userId) => api.get(`/chat-service/rooms/me/${userId}`),
  getRoomParticipants: (roomId) => api.get(`/chat-service/rooms/${roomId}/participants`),

  // 메시지 관련
  getMessages: (roomId, page = 0, size = 20) =>
    api.get(`/chat-service/rooms/${roomId}/messages?page=${page}&size=${size}`),
  sendMessage: (roomId, data) => api.post(`/chat-service/rooms/${roomId}/messages`, data),
  markAsRead: (roomId, data) => api.post(`/chat-service/rooms/${roomId}/messages/read`, data),

  // WebSocket 관련
  checkMembership: (roomId, userId) => api.get(`/chat-service/rooms/${roomId}/members/${userId}`),
};
