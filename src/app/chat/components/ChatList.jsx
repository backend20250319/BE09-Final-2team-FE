"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { chatAPI } from "../../../lib/api";
import { useUser } from "../../../store/userStore";

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useUser();

  // 채팅방 목록 조회
  useEffect(() => {
    const fetchRooms = async () => {
      if (!user?.id) return;

      try {
        const response = await chatAPI.getMyRooms(user.id);
        if (response.data.success) {
          setRooms(response.data.data || []);
        } else {
          setError("채팅방 목록을 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("채팅방 목록 조회 오류:", error);
        setError("채팅방 목록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRooms();
    }
  }, [user?.id]);

  // 새 채팅방 생성
  const createRoom = async () => {
    try {
      const roomData = {
        productId: 1, // 테스트용 상품 ID
        buyerId: user?.id || 1, // 현재 사용자 ID
        sellerId: 2, // 테스트용 판매자 ID
      };

      const response = await chatAPI.createRoom(roomData);
      if (response.data.success) {
        // 새로 생성된 방으로 이동
        window.location.href = `/chat/${response.data.data.id}`;
      } else {
        setError("채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성 오류:", error);
      setError("채팅방 생성에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* 헤더 */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">채팅방 목록</h1>
            <button onClick={createRoom} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              새 채팅방
            </button>
          </div>
        </div>

        {/* 채팅방 목록 */}
        <div className="p-6">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {rooms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">채팅방이 없습니다.</p>
              <button onClick={createRoom} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                첫 번째 채팅방 만들기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/chat/${room.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">채팅방 {room.id}</h3>
                      {room.lastMessage && <p className="text-sm text-gray-600 mt-1">{room.lastMessage}</p>}
                      {room.lastSentAt && (
                        <p className="text-xs text-gray-400 mt-1">{new Date(room.lastSentAt).toLocaleString()}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {room.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
