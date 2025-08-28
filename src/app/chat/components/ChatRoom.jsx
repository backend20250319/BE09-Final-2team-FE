"use client";

import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { chatAPI } from "../../../lib/api";
import { useUser } from "../../../store/userStore";

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState("테스트유저");
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const user = useUser();

  // 사용자 정보 설정
  useEffect(() => {
    if (user) {
      setSenderName(user.nickname || user.name || user.loginId || "사용자");
      setUserLoading(false);
    } else {
      setUserLoading(false);
    }
  }, [user]);

  // 기존 메시지 로드
  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId || !user?.id) return;

      try {
        const response = await chatAPI.getMessages(roomId, 0, 50);
        if (response.data.success) {
          setMessages(response.data.data.content || []);
        }
      } catch (error) {
        console.error("메시지 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roomId && user?.id) {
      loadMessages();
    } else if (!user?.id) {
      setLoading(false);
    }
  }, [roomId, user?.id]);

  // 메시지 수신 핸들러
  const handleMessageReceived = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  // WebSocket 훅 사용 (userId가 있을 때만)
  const { isConnected, error, sendMessage, joinRoom } = useWebSocket(roomId, user?.id, handleMessageReceived);

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 방 입장
  const handleJoinRoom = () => {
    if (joinRoom(senderName)) {
      setIsJoined(true);
    }
  };

  // 메시지 전송
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (sendMessage(newMessage, senderName)) {
      setNewMessage("");
    }
  };

  // 연결 상태 표시
  const getConnectionStatus = () => {
    if (error) return { text: "연결 오류", color: "text-red-500" };
    if (isConnected) return { text: "연결됨", color: "text-green-500" };
    return { text: "연결 중...", color: "text-yellow-500" };
  };

  const status = getConnectionStatus();

  // roomId가 없으면 에러 표시
  if (!roomId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">채팅방을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">올바른 채팅방 URL로 접속해주세요.</p>
          <button
            onClick={() => (window.location.href = "/chat")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            채팅방 목록으로
          </button>
        </div>
      </div>
    );
  }

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">채팅방 {roomId}</h1>
            <p className={`text-sm ${status.color}`}>{status.text}</p>
          </div>
          {!isJoined && (
            <button
              onClick={handleJoinRoom}
              disabled={!isConnected}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              방 입장
            </button>
          )}
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {isJoined ? "메시지를 입력해보세요!" : "방에 입장해주세요."}
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <div className="text-xs opacity-75 mb-1">{message.senderName || "알 수 없음"}</div>
                <div className="text-sm">{message.content || message.message}</div>
                {message.sentAt && (
                  <div className="text-xs opacity-75 mt-1">{new Date(message.sentAt).toLocaleTimeString()}</div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      {isJoined && (
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
            <button
              type="submit"
              disabled={!isConnected || !newMessage.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              전송
            </button>
          </form>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
          <strong>오류:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
