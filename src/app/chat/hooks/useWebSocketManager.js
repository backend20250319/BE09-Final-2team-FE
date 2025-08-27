import { useState, useEffect, useCallback } from "react";
import websocketManager from "../../../lib/websocketManager";
import { useUser } from "../../../store/userStore";

export const useWebSocketManager = (roomId, userId, onMessageReceived) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const user = useUser();

  // 연결 상태 동기화
  useEffect(() => {
    const updateConnectionStatus = () => {
      const status = websocketManager.getConnectionStatus();
      setIsConnected(status.isConnected);
      setError(status.error);
    };

    // 초기 상태 설정
    updateConnectionStatus();

    // 주기적으로 상태 확인 (1초마다)
    const interval = setInterval(updateConnectionStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  // 채팅방 구독
  const subscribeToRoom = useCallback(() => {
    if (!roomId || !userId) {
      console.log("구독 조건 미충족:", { roomId, userId });
      return false;
    }

    return websocketManager.subscribeToRoom(roomId, onMessageReceived);
  }, [roomId, userId, onMessageReceived]);

  // 채팅방 구독 해제
  const unsubscribeFromRoom = useCallback(() => {
    if (roomId) {
      websocketManager.unsubscribeFromRoom(roomId);
    }
  }, [roomId]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content, senderName) => {
      if (!roomId || !userId) {
        setError("채팅방 정보가 없습니다.");
        return false;
      }

      return websocketManager.sendMessage(roomId, userId, senderName, content);
    },
    [roomId, userId]
  );

  // 방 입장
  const joinRoom = useCallback(
    (senderName) => {
      if (!roomId || !userId) {
        return false;
      }

      return websocketManager.joinRoom(roomId, userId, senderName);
    },
    [roomId, userId]
  );

  // 읽음 처리
  const markAsRead = useCallback(
    (messageIds) => {
      if (!roomId || !userId) {
        return false;
      }

      return websocketManager.markAsRead(roomId, userId, messageIds);
    },
    [roomId, userId]
  );

  // 컴포넌트 마운트 시 채팅방 구독
  useEffect(() => {
    if (isConnected && roomId && userId) {
      subscribeToRoom();
    }
  }, [isConnected, roomId, userId, subscribeToRoom]);

  // 컴포넌트 언마운트 시 채팅방 구독 해제
  useEffect(() => {
    return () => {
      unsubscribeFromRoom();
    };
  }, [unsubscribeFromRoom]);

  return {
    isConnected,
    error,
    sendMessage,
    joinRoom,
    markAsRead,
  };
};
